import { useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { useAuth } from "../contexts/AuthContext";
import { useWorkspaceData } from "../hooks/useWorkspaceData";
import { analyzeSkillGap, generateRoadmap } from "../services/aiService";
import { Sparkles, Calendar, TrendingUp } from "lucide-react";

export default function RoadmapPage() {
  const { signOut, userEmail } = useAuth();
  const { state, isLoading, saveAssessment, banner } = useWorkspaceData();
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const nextAssessment = await analyzeSkillGap({
        profile: state.profile,
        resumeText: state.resume?.extractedText ?? "Sin CV cargado",
      });
      const nextRoadmap = await generateRoadmap(nextAssessment);
      await saveAssessment(nextAssessment, nextRoadmap);
    } catch (error) {
      console.error("Error al generar roadmap:", error);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { key: "30 días", label: "Corto Plazo (30 días)", color: "var(--accent)" },
    { key: "90 días", label: "Mediano Plazo (90 días)", color: "#3167f6" },
    { key: "6 meses", label: "Largo Plazo (6 meses)", color: "#10b981" },
  ] as const;

  return (
    <AppShell email={userEmail} onSignOut={signOut}>
      <div className="space-y-6">
        <div className="surface min-w-0 overflow-hidden">
          <div className="grid min-w-0 gap-5 p-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-center">
            <div>
              <p className="eyebrow">Roadmap de Crecimiento</p>
              <h1 className="mt-3 text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
                Roadmap de Upskilling
              </h1>
              <p className="mt-2 text-sm text-muted">
                Prioriza tus acciones de desarrollo profesional clasificadas en objetivos a 30 días, 90 días y 6 meses.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="btn-primary w-full justify-center gap-2"
                onClick={handleGenerate}
                disabled={loading || isLoading}
              >
                <Sparkles className="h-4 w-4" />
                {loading ? "Generando..." : "Regenerar Roadmap"}
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
            Cargando roadmap...
          </div>
        ) : state.roadmap.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {columns.map((col) => {
              const items = state.roadmap.filter((item) => item.horizon === col.key);

              return (
                <div key={col.key} className="surface flex flex-col p-6 min-h-[500px]">
                  <div className="mb-5 flex items-center gap-3 pb-3 border-b border-[var(--border)]">
                    <Calendar className="h-5 w-5" style={{ color: col.color }} />
                    <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                      {col.label}
                    </h3>
                  </div>

                  <div className="flex-1 space-y-4">
                    {items.length > 0 ? (
                      items.map((item) => (
                        <Link
                          key={`${item.horizon}-${item.skill}`}
                          to={`/skill/${encodeURIComponent(item.skill)}`}
                          className="soft-card block min-w-0 p-5 border-l-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_45%,transparent)] cursor-pointer"
                          style={{ borderLeftColor: col.color }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="text-base font-bold leading-6" style={{ color: "var(--text-primary)" }}>
                              {item.skill}
                            </h4>
                            <span className="badge-pill whitespace-nowrap shrink-0">{item.priority}</span>
                          </div>
                          <p className="mt-3 text-xs leading-6 text-muted">{item.reason}</p>
                          <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center gap-2 text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                            <TrendingUp className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
                            <span>Impacto: {item.expectedImpact}</span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 border border-dashed border-[var(--border)] rounded-2xl p-5 text-center">
                        <p className="text-xs text-muted">Sin acciones definidas para este periodo.</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="surface p-12 text-center max-w-xl mx-auto space-y-4">
            <h3 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              No tienes un Roadmap generado
            </h3>
            <p className="text-sm text-muted">
              Usa el botón de arriba para analizar tu perfil profesional actual y generar un mapa de ruta personalizado.
            </p>
            <button
              type="button"
              className="btn-primary gap-2 mt-2"
              onClick={handleGenerate}
              disabled={loading}
            >
              <Sparkles className="h-4 w-4" />
              {loading ? "Generando..." : "Generar Roadmap por primera vez"}
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
