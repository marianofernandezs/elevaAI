import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useAuth } from "../contexts/AuthContext";
import { useWorkspaceData } from "../hooks/useWorkspaceData";
import { generateInitialProfileAnalysis } from "../services/aiService";
import { debugError, debugLog } from "../utils/debugLogger";
import { buildInitialDiagnosisFromProfile } from "../utils/initialDiagnosis";
import { hasProfileAnalysis } from "../utils/profile";
import { userFacingMessages } from "../utils/userFacingMessages";

export default function InitialDiagnosisPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { state, isLoading, profileComplete, saveInitialProfileAnalysis } = useWorkspaceData();
  const [isPreparingWorkspace, setIsPreparingWorkspace] = useState(false);
  const [error, setError] = useState("");

  const diagnosis = useMemo(() => buildInitialDiagnosisFromProfile(state.profile), [state.profile]);
  const analysisReady = hasProfileAnalysis(state.profileAnalysis);

  useEffect(() => {
    if (!profileComplete || analysisReady) {
      return;
    }

    let ignore = false;

    async function ensureAnalysis() {
      setIsPreparingWorkspace(true);
      setError("");

      try {
        const analysis = await generateInitialProfileAnalysis(state.profile);
        if (ignore) {
          return;
        }

        await saveInitialProfileAnalysis(analysis);
        debugLog("Initial profile analysis prepared for diagnosis page.");
      } catch (nextError) {
        debugError("Unable to prepare initial diagnosis analysis.", nextError);
        if (!ignore) {
          setError(userFacingMessages.onboarding.diagnosisError);
        }
      } finally {
        if (!ignore) {
          setIsPreparingWorkspace(false);
        }
      }
    }

    void ensureAnalysis();

    return () => {
      ignore = true;
    };
  }, [analysisReady, profileComplete, saveInitialProfileAnalysis, state.profile]);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!isLoading && !profileComplete) {
    return (
      <div className="min-h-screen px-4 py-6 md:px-6 md:py-10">
        <div className="mx-auto mb-6 flex max-w-4xl justify-end">
          <ThemeToggle />
        </div>
        <div className="surface mx-auto max-w-3xl p-8 text-center md:p-10">
          <p className="eyebrow">Diagnóstico inicial</p>
          <h1 className="mt-4 text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
            {userFacingMessages.onboarding.missingProfile}
          </h1>
          <p className="mt-4 text-base leading-7 text-muted">
            Completa tu onboarding para que podamos darte una lectura útil y personalizada de tu punto de partida.
          </p>
          <button type="button" className="btn-primary mx-auto mt-8" onClick={() => navigate("/onboarding")}>
            Completar onboarding
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto mb-6 flex max-w-6xl justify-end">
        <ThemeToggle />
      </div>

      <div className="mx-auto max-w-6xl space-y-6">
        <header className="surface flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="eyebrow">Diagnóstico inicial</p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl" style={{ color: "var(--text-primary)" }}>
              Tu diagnóstico inicial está listo
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-muted">
              Usamos tu información para detectar tu punto de partida y tus primeras acciones recomendadas.
            </p>
          </div>
          <div className="rounded-[1.5rem] border px-5 py-4 text-sm font-semibold" style={{ borderColor: "var(--border)", background: "var(--panel-muted)", color: "var(--accent)" }}>
            Perfil analizado
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          <article className="surface p-6">
            <p className="eyebrow">Tu posicionamiento actual</p>
            <p className="mt-4 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
              {diagnosis.positioning}
            </p>
          </article>

          <article className="surface p-6">
            <p className="eyebrow">Tu mayor oportunidad</p>
            <p className="mt-4 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
              {diagnosis.opportunity}
            </p>
          </article>

          <article className="surface p-6">
            <p className="eyebrow">Tu principal riesgo</p>
            <p className="mt-4 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
              {diagnosis.risk}
            </p>
          </article>

          <article className="surface p-6">
            <p className="eyebrow">Tus primeras 3 acciones recomendadas</p>
            <div className="mt-4 space-y-3">
              {diagnosis.recommendedActions.map((item) => (
                <div key={item.title} className="soft-card p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" style={{ color: "var(--accent)" }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-muted">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="surface p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="eyebrow">Siguiente paso</p>
              <h2 className="mt-3 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                Llevemos este diagnóstico a una primera acción concreta
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                {isPreparingWorkspace
                  ? "Estamos terminando de preparar tu workspace para que entres con contexto completo."
                  : "Tu workspace ya puede ayudarte a convertir este diagnóstico en contenido, mejoras de perfil y próximos pasos."}
              </p>
              {error ? (
                <p className="mt-3 text-sm font-semibold text-red-500">{error}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-3 md:min-w-[280px]">
              <button
                type="button"
                className="btn-primary justify-center gap-2"
                onClick={() => navigate("/workspace?intent=create_post")}
                disabled={!analysisReady || isPreparingWorkspace}
              >
                <Sparkles className="h-4 w-4" />
                Abrir mi workspace y crear mi primer post
              </button>
              <button
                type="button"
                className="btn-secondary justify-center gap-2"
                onClick={() => navigate("/workspace")}
                disabled={!analysisReady || isPreparingWorkspace}
              >
                <ArrowRight className="h-4 w-4" />
                Ir al workspace
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
