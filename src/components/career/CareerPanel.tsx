import { useState } from "react";
import { analyzeSkillGap, generateRoadmap } from "../../services/aiService";
import type { ResumeAsset, RoadmapItem, SkillAssessment, UserProfile } from "../../types";

interface CareerPanelProps {
  profile: UserProfile;
  resume: ResumeAsset | null;
  assessment: SkillAssessment;
  roadmap: RoadmapItem[];
  onUpdate: (assessment: SkillAssessment, roadmap: RoadmapItem[]) => Promise<void> | void;
  hideHeader?: boolean;
}

export default function CareerPanel({
  profile,
  resume,
  assessment,
  roadmap,
  onUpdate,
  hideHeader = false,
}: CareerPanelProps) {
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    setLoading(true);
    const nextAssessment = await analyzeSkillGap({
      profile,
      resumeText: resume?.extractedText ?? "Sin CV cargado",
    });
    const nextRoadmap = await generateRoadmap(nextAssessment);
    onUpdate(nextAssessment, nextRoadmap);
    setLoading(false);
  }

  return (
    <section className="grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)]">
      <div className="min-w-0 space-y-6">
        <div className="surface min-w-0 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {!hideHeader ? (
              <div>
                <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Skill Gap Analysis</h3>
                <p className="mt-2 text-sm text-muted">
                  Cruza perfil, CV y señales de mercado para detectar oportunidades de mejora.
                </p>
              </div>
            ) : <div />}
            <button type="button" className="btn-primary" onClick={handleAnalyze} disabled={loading}>
              {loading ? "Analizando..." : "Actualizar análisis"}
            </button>
          </div>

          <div className="surface-hero mt-6 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.2em]" style={{ color: "var(--accent-strong)" }}>Competitiveness Score</p>
            <p className="mt-3 font-display text-6xl">{assessment.competitivenessScore}</p>
            <p className="mt-4 text-sm leading-7 text-white/75">
              Tu puntaje combina claridad de posicionamiento, visibilidad y alineación con skills de demanda.
            </p>
          </div>
        </div>

        <div className="surface min-w-0 p-6">
          <h4 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Hallazgos clave</h4>
          <div className="mt-4 grid min-w-0 gap-4 md:grid-cols-2">
            <ListCard title="Skills actuales" items={assessment.currentSkills} />
            <ListCard title="Skills faltantes" items={assessment.missingSkills} />
            <ListCard title="Skills emergentes" items={assessment.emergingSkills} />
            <ListCard title="Fortalezas" items={assessment.strengths} />
          </div>
          <div className="mt-4">
            <ListCard title="Debilidades" items={assessment.weaknesses} />
          </div>
        </div>
      </div>

      <div className="surface min-w-0 p-6">
        {!hideHeader && (
          <div className="mb-5">
            <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Roadmap de Upskilling</h3>
            <p className="mt-2 text-sm text-muted">
              Acciones priorizadas para 30 días, 90 días y 6 meses con impacto esperado.
            </p>
          </div>
        )}

        <div className="mt-5 space-y-4">
          {roadmap.map((item) => (
            <article key={`${item.horizon}-${item.skill}`} className="soft-card min-w-0 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="eyebrow">{item.horizon}</p>
                  <h4 className="mt-2 text-lg font-bold" style={{ color: "var(--text-primary)" }}>{item.skill}</h4>
                </div>
                <span className="badge-pill" style={{ letterSpacing: "0.02em" }}>{item.priority}</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted">{item.reason}</p>
              <p className="mt-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Impacto esperado: {item.expectedImpact}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="soft-card min-w-0 p-5">
      <h5 className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text-primary)" }}>{title}</h5>
      <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 break-words">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--accent)" }} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
