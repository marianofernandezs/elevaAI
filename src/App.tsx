import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <DashboardPage />;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/auth"
        element={isAuthenticated ? <Navigate to="/app" replace /> : <AuthPage />}
      />
      <Route path="/app" element={<ProtectedRoute />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/app" : "/"} replace />} />
    </Routes>
  );
}
