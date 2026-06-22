import { useEffect, useState, type ReactNode } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import AuthPage from "./pages/AuthPage";
import InitialDiagnosisPage from "./pages/InitialDiagnosisPage";
import LandingPage from "./pages/LandingPage";
import OnboardingPage from "./pages/OnboardingPage";
import ProfileAnalysisLoadingPage from "./pages/ProfileAnalysisLoadingPage";
import SettingsPage from "./pages/SettingsPage";
import WorkspacePage from "./pages/WorkspacePage";
import ProfilePage from "./pages/ProfilePage";
import CVPage from "./pages/CVPage";
import SkillGapPage from "./pages/SkillGapPage";
import RoadmapPage from "./pages/RoadmapPage";
import LibraryPage from "./pages/LibraryPage";
import SkillDetailPage from "./pages/SkillDetailPage";
import { loadUserProfile, loadUserProfileAnalysis } from "./services/dashboardService";
import { hasProfileAnalysis, isProfessionalProfileComplete } from "./utils/profile";

type FlowStatus = "needs_profile" | "needs_analysis" | "ready";

function readLocalFlowStatus(): FlowStatus {
  const raw = window.localStorage.getItem("career-linkedin-copilot-state");
  if (!raw) {
    return "needs_profile";
  }

  const parsed = JSON.parse(raw) as { profile?: unknown; profileAnalysis?: unknown };
  const profile = parsed.profile && typeof parsed.profile === "object" ? parsed.profile : null;
  const profileAnalysis =
    parsed.profileAnalysis && typeof parsed.profileAnalysis === "object" ? parsed.profileAnalysis : null;

  if (!isProfessionalProfileComplete(profile as Parameters<typeof isProfessionalProfileComplete>[0])) {
    return "needs_profile";
  }

  return hasProfileAnalysis(profileAnalysis as Parameters<typeof hasProfileAnalysis>[0])
    ? "ready"
    : "needs_analysis";
}

function ProtectedRoute({
  children,
  allow,
}: {
  children: ReactNode;
  allow: FlowStatus[];
}) {
  const { isAuthenticated, isLoading, userId } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [flowStatus, setFlowStatus] = useState<FlowStatus>("needs_profile");

  useEffect(() => {
    let ignore = false;
    setIsChecking(true);

    async function resolveFlowStatus() {
      if (!isAuthenticated) {
        setIsChecking(false);
        return;
      }

      if (userId === "local-user") {
        if (!ignore) {
          setFlowStatus(readLocalFlowStatus());
          setIsChecking(false);
        }
        return;
      }

      if (!userId) {
        if (!ignore) {
          setFlowStatus("needs_profile");
          setIsChecking(false);
        }
        return;
      }

      try {
        const [profile, analysis] = await Promise.all([
          loadUserProfile(userId),
          loadUserProfileAnalysis(userId),
        ]);

        if (ignore) {
          return;
        }

        if (!isProfessionalProfileComplete(profile)) {
          setFlowStatus("needs_profile");
        } else if (!hasProfileAnalysis(analysis)) {
          setFlowStatus("needs_analysis");
        } else {
          setFlowStatus("ready");
        }
      } catch (err) {
        if (!ignore) {
          setFlowStatus("needs_profile");
        }
      } finally {
        if (!ignore) {
          setIsChecking(false);
        }
      }
    }

    void resolveFlowStatus();

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, userId, location.pathname]);

  if (isLoading || isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm font-semibold text-slate-600">
        Validando sesión y estado de onboarding...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!allow.includes(flowStatus)) {
    if (flowStatus === "needs_profile") {
      return <Navigate to="/onboarding" replace />;
    }

    if (flowStatus === "needs_analysis") {
      return <Navigate to="/profile-analysis-loading" replace />;
    }

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
      <Route path="/auth" element={isAuthenticated ? <Navigate to="/workspace" replace /> : <AuthPage />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute allow={["needs_profile"]}>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/initial-diagnosis"
        element={
          <ProtectedRoute allow={["ready"]}>
            <InitialDiagnosisPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile-analysis-loading"
        element={
          <ProtectedRoute allow={["needs_analysis"]}>
            <ProfileAnalysisLoadingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace"
        element={
          <ProtectedRoute allow={["ready"]}>
            <WorkspacePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allow={["ready"]}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume-upload"
        element={
          <ProtectedRoute allow={["ready"]}>
            <CVPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/skill-gap"
        element={
          <ProtectedRoute allow={["ready"]}>
            <SkillGapPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roadmap"
        element={
          <ProtectedRoute allow={["ready"]}>
            <RoadmapPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/skill/:skillName"
        element={
          <ProtectedRoute allow={["ready"]}>
            <SkillDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/library"
        element={
          <ProtectedRoute allow={["ready"]}>
            <LibraryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace/posts"
        element={
          <ProtectedRoute allow={["ready"]}>
            <WorkspacePage initialModule="posts" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace/ideas"
        element={
          <ProtectedRoute allow={["ready"]}>
            <WorkspacePage initialModule="ideas" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute allow={["ready"]}>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/workspace" : "/"} replace />} />
    </Routes>
  );
}
