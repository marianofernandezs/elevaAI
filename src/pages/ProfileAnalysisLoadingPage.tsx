import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useAuth } from "../contexts/AuthContext";
import { useWorkspaceData } from "../hooks/useWorkspaceData";
import { generateInitialProfileAnalysis } from "../services/aiService";
import { hasProfileAnalysis } from "../utils/profile";

const loadingSteps = [
  "Perfil profesional",
  "Nicho",
  "Industria",
  "Objetivo profesional",
  "Oportunidades LinkedIn",
  "Skills prioritarias",
  "Recomendación inicial",
] as const;

export default function ProfileAnalysisLoadingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { state, isLoading, profileComplete, saveInitialProfileAnalysis } = useWorkspaceData();
  const [activeStep, setActiveStep] = useState(0);
  const [statusText, setStatusText] = useState("Preparando contexto base...");

  const progress = useMemo(
    () => Math.min(100, ((activeStep + 1) / loadingSteps.length) * 100),
    [activeStep],
  );

  useEffect(() => {
    if (!profileComplete) {
      return;
    }

    if (hasProfileAnalysis(state.profileAnalysis)) {
      navigate("/workspace", { replace: true });
      return;
    }

    let ignore = false;
    const interval = window.setInterval(() => {
      setActiveStep((current) => {
        const next = Math.min(current + 1, loadingSteps.length - 1);
        setStatusText(`Analizando ${loadingSteps[next].toLowerCase()}...`);
        return next;
      });
    }, 900);

    async function runAnalysis() {
      try {
        const analysis = await generateInitialProfileAnalysis(state.profile);
        if (ignore) {
          return;
        }

        await saveInitialProfileAnalysis(analysis);
        if (!ignore) {
          setActiveStep(loadingSteps.length - 1);
          setStatusText("Listo. Redirigiendo a tu diagnóstico...");
          window.setTimeout(() => navigate("/initial-diagnosis", { replace: true }), 700);
        }
      } catch {
        if (!ignore) {
          setStatusText("No pudimos completar el análisis. Reintenta recargando la página.");
        }
      } finally {
        window.clearInterval(interval);
      }
    }

    void runAnalysis();

    return () => {
      ignore = true;
      window.clearInterval(interval);
    };
  }, [navigate, profileComplete, saveInitialProfileAnalysis, state.profile, state.profileAnalysis]);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!isLoading && !profileComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  if (hasProfileAnalysis(state.profileAnalysis)) {
    return <Navigate to="/workspace" replace />;
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto mb-6 flex max-w-4xl justify-end">
        <ThemeToggle />
      </div>

      <div className="surface mx-auto max-w-4xl p-8 md:p-10">
        <p className="eyebrow">Análisis inicial</p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl" style={{ color: "var(--text-primary)" }}>
          Estamos construyendo tu mapa inicial de posicionamiento.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
          elevaIA está analizando tu perfil profesional para detectar foco, oportunidades LinkedIn, skills prioritarias y una recomendación inicial antes de abrir tu workspace.
        </p>

        <div className="mt-8 h-3 overflow-hidden rounded-full bg-black/5">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 text-sm font-semibold" style={{ color: "var(--accent)" }}>
          {statusText}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {loadingSteps.map((step, index) => (
            <div
              key={step}
              className="soft-card px-5 py-4"
              style={{
                borderColor: index <= activeStep ? "color-mix(in srgb, var(--accent) 50%, transparent)" : "var(--border)",
                background:
                  index <= activeStep
                    ? "color-mix(in srgb, var(--accent-soft) 72%, transparent)"
                    : "color-mix(in srgb, var(--panel-muted) 76%, transparent)",
              }}
            >
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {step}
              </p>
              <p className="mt-2 text-sm text-muted">
                {index < activeStep ? "Listo" : index === activeStep ? "En proceso" : "Pendiente"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
