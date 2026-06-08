import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { captureAppError } from "../lib/sentry";
import { hasSupabaseEnv, supabase } from "../lib/supabase";

interface AuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  userId: string;
  userEmail: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ requiresEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const localEmailKey = "career-linkedin-copilot-email";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState(() => window.localStorage.getItem(localEmailKey) ?? "");

  useEffect(() => {
    if (!hasSupabaseEnv || !supabase) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        captureAppError(error, { scope: "auth:getUser" });
        setIsLoading(false);
        return;
      }

      setUserId(data.user?.id ?? "");
      setUserEmail(data.user?.email ?? "");
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? "");
      setUserEmail(session?.user.email ?? "");
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (userEmail) {
      window.localStorage.setItem(localEmailKey, userEmail);
      return;
    }

    window.localStorage.removeItem(localEmailKey);
  }, [userEmail]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      isAuthenticated: Boolean(userEmail),
      userId,
      userEmail,
      async signIn(email, password) {
        if (!hasSupabaseEnv || !supabase) {
          setUserId("local-user");
          setUserEmail(email);
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          captureAppError(error, { scope: "auth:signIn" });
          throw new Error("No pudimos iniciar sesión. Revisa tus credenciales.");
        }
      },
      async signUp(email, password) {
        if (!hasSupabaseEnv || !supabase) {
          setUserId("local-user");
          setUserEmail(email);
          return { requiresEmailConfirmation: false };
        }

        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          captureAppError(error, { scope: "auth:signUp" });
          throw new Error("No pudimos crear tu cuenta. Intenta nuevamente.");
        }

        return {
          requiresEmailConfirmation: !data.session,
        };
      },
      async signOut() {
        if (hasSupabaseEnv && supabase) {
          const { error } = await supabase.auth.signOut();
          if (error) {
            captureAppError(error, { scope: "auth:signOut" });
          }
        }

        setUserId("");
        setUserEmail("");
      },
    }),
    [isLoading, userEmail, userId],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}
