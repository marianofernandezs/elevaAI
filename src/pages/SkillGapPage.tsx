import { useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { useAuth } from "../contexts/AuthContext";
import { useWorkspaceData } from "../hooks/useWorkspaceData";
import { analyzeSkillGap, generateRoadmap } from "../services/aiService";

export default function SkillGapPage() {
  const { signOut, userEmail } = useAuth();
  const { state, isLoading, saveAssessment, banner } = useWorkspaceData();
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    setLoading(true);
    try {
      const nextAssessment = await analyzeSkillGap({
        profile: state.profile,
        resumeText: state.resume?.extractedText ?? "Sin CV cargado",
      });
      const nextRoadmap = await generateRoadmap(nextAssessment);
      await saveAssessment(nextAssessment, nextRoadmap);
    } catch (error) {
      console.error("Error al actualizar análisis:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell email={userEmail} onSignOut={signOut}>
      <div className="space-y-6">
        <div className="surface min-w-0 overflow-hidden">
          <div className="grid min-w-0 gap-5 p-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-center">
            <div>
              <p className="eyebrow">Skill Gap Analysis</p>
              <h1 className="mt-3 text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
                Análisis de brechas y competitividad
              </h1>
              <p className="mt-2 text-sm text-muted">
                Cruza perfil, CV y señales de mercado para detectar oportunidades de mejora en tu posicionamiento.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button type="button" className="btn-primary w-full justify-center" onClick={handleAnalyze} disabled={loading || isLoading}>
                {loading ? "Analizando..." : "Actualizar análisis"}
              </button>
              {banner && (
                <div className="soft-card min-w-0 p-3 text-xs leading-5 text-muted break-words text-center">
                  {banner}
                </div>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="surface p-6 text-sm font-semibold text-muted">
            Cargando análisis...
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="surface p-6 lg:col-span-1">
              <div>
                <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Competitiveness Score</h3>
                <p className="mt-2 text-sm text-muted">
                  Tu puntaje combina posicionamiento, visibilidad y demanda.
                </p>
              </div>
              <div className="surface-hero mt-6 p-8 text-center text-white">
                <p className="text-sm uppercase tracking-[0.2em]" style={{ color: "var(--accent-strong)" }}>Competitiveness Score</p>
                <p className="mt-4 font-display text-7xl font-extrabold">{state.assessment.competitivenessScore}</p>
                <p className="mt-4 text-xs leading-6 text-white/70">
                  Calculado a partir de la optimización de tu perfil y la relevancia de tus habilidades actuales frente a las tendencias de la industria.
                </p>
              </div>
            </div>

            <div className="surface p-6 lg:col-span-2">
              <h3 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Hallazgos clave</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <ListCard title="Skills actuales" items={state.assessment.currentSkills} />
                <ListCard title="Skills faltantes" items={state.assessment.missingSkills} />
                <ListCard title="Skills emergentes" items={state.assessment.emergingSkills} />
                <ListCard title="Fortalezas" items={state.assessment.strengths} />
              </div>
              <div className="mt-4">
                <ListCard title="Debilidades" items={state.assessment.weaknesses} />
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="soft-card min-w-0 p-5">
      <h5 className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text-primary)" }}>{title}</h5>
      {items && items.length > 0 ? (
        <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3 break-words">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--accent)" }} />
              <Link
                to={`/skill/${encodeURIComponent(item)}`}
                className="hover:text-[var(--accent)] hover:underline transition duration-150 cursor-pointer"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-xs text-muted">No se registran elementos.</p>
      )}
    </div>
  );
}
