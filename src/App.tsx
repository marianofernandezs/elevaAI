import { useEffect, useState, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import OnboardingPage from "./pages/OnboardingPage";
import WorkspacePage from "./pages/WorkspacePage";
import { loadUserProfile } from "./services/dashboardService";
import { isProfessionalProfileComplete } from "./utils/profile";

function ProtectedRoute({
  children,
  requireCompleteProfile = true,
}: {
  children: ReactNode;
  requireCompleteProfile?: boolean;
}) {
  const { isAuthenticated, isLoading, userId } = useAuth();
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [hasCompleteProfile, setHasCompleteProfile] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function checkProfile() {
      if (!isAuthenticated) {
        setIsCheckingProfile(false);
        return;
      }

      if (userId === "local-user") {
        const storedState = window.localStorage.getItem("career-linkedin-copilot-state");
        const profile = storedState ? (JSON.parse(storedState) as { profile?: unknown }).profile : null;
        if (!ignore) {
          setHasCompleteProfile(
            isProfessionalProfileComplete(
              profile && typeof profile === "object" ? (profile as Parameters<typeof isProfessionalProfileComplete>[0]) : null,
            ),
          );
          setIsCheckingProfile(false);
        }
        return;
      }

      if (!userId) {
        if (!ignore) {
          setHasCompleteProfile(false);
          setIsCheckingProfile(false);
        }
        return;
      }

      try {
        const profile = await loadUserProfile(userId);
        if (!ignore) {
          setHasCompleteProfile(isProfessionalProfileComplete(profile));
        }
      } catch {
        if (!ignore) {
          setHasCompleteProfile(false);
        }
      } finally {
        if (!ignore) {
          setIsCheckingProfile(false);
        }
      }
    }

    void checkProfile();

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, userId]);

  if (isLoading || isCheckingProfile) {
    return <div className="flex min-h-screen items-center justify-center text-sm font-semibold text-slate-600">Validando sesión...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requireCompleteProfile && !hasCompleteProfile) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!requireCompleteProfile && hasCompleteProfile) {
    return <Navigate to="/workspace" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-sm font-semibold text-slate-600">Cargando aplicación...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/auth"
        element={isAuthenticated ? <Navigate to="/workspace" replace /> : <AuthPage />}
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute requireCompleteProfile={false}>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace"
        element={
          <ProtectedRoute>
            <WorkspacePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <WorkspacePage initialModule="profile" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume-upload"
        element={
          <ProtectedRoute>
            <WorkspacePage initialModule="resume" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/skill-gap"
        element={
          <ProtectedRoute>
            <WorkspacePage initialModule="skills" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roadmap"
        element={
          <ProtectedRoute>
            <WorkspacePage initialModule="roadmap" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/library"
        element={
          <ProtectedRoute>
            <WorkspacePage initialModule="library" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace/posts"
        element={
          <ProtectedRoute>
            <WorkspacePage initialModule="posts" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace/ideas"
        element={
          <ProtectedRoute>
            <WorkspacePage initialModule="ideas" />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/workspace" : "/"} replace />} />
    </Routes>
  );
}
