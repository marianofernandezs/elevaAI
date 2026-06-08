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
  isAuthenticated: boolean;
  userEmail: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const localEmailKey = "career-linkedin-copilot-email";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState(() => window.localStorage.getItem(localEmailKey) ?? "");

  useEffect(() => {
    if (!hasSupabaseEnv || !supabase) {
      return;
    }

    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        captureAppError(error, { scope: "auth:getUser" });
        return;
      }

      setUserEmail(data.user?.email ?? "");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? "");
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
      isAuthenticated: Boolean(userEmail),
      userEmail,
      async signIn(email, password) {
        if (!hasSupabaseEnv || !supabase) {
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
          setUserEmail(email);
          return;
        }

        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
          captureAppError(error, { scope: "auth:signUp" });
          throw new Error("No pudimos crear tu cuenta. Intenta nuevamente.");
        }
      },
      async signOut() {
        if (hasSupabaseEnv && supabase) {
          const { error } = await supabase.auth.signOut();
          if (error) {
            captureAppError(error, { scope: "auth:signOut" });
          }
        }

        setUserEmail("");
      },
    }),
    [userEmail],
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
