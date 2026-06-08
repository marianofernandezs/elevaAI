import { useState } from "react";
import { analyzeSkillGap, generateRoadmap } from "../../services/aiService";
import type { ResumeAsset, RoadmapItem, SkillAssessment, UserProfile } from "../../types";

interface CareerPanelProps {
  profile: UserProfile;
  resume: ResumeAsset | null;
  assessment: SkillAssessment;
  roadmap: RoadmapItem[];
  onUpdate: (assessment: SkillAssessment, roadmap: RoadmapItem[]) => void;
}

export default function CareerPanel({
  profile,
  resume,
  assessment,
  roadmap,
  onUpdate,
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
    <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-6">
        <div className="surface p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-950">Skill Gap Analysis</h3>
              <p className="mt-2 text-sm text-slate-600">
                Cruza perfil, CV y señales de mercado para detectar oportunidades de mejora.
              </p>
            </div>
            <button type="button" className="btn-primary" onClick={handleAnalyze} disabled={loading}>
              {loading ? "Analizando..." : "Actualizar análisis"}
            </button>
          </div>

          <div className="mt-6 rounded-3xl bg-slate-950 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-amber-300">Competitiveness Score</p>
            <p className="mt-3 font-display text-6xl">{assessment.competitivenessScore}</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Tu puntaje combina claridad de posicionamiento, visibilidad y alineación con skills de demanda.
            </p>
          </div>
        </div>

        <div className="surface p-6">
          <h4 className="text-lg font-bold text-slate-950">Hallazgos clave</h4>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
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

      <div className="surface p-6">
        <h3 className="text-xl font-bold text-slate-950">Roadmap de Upskilling</h3>
        <p className="mt-2 text-sm text-slate-600">
          Acciones priorizadas para 30 días, 90 días y 6 meses con impacto esperado.
        </p>

        <div className="mt-5 space-y-4">
          {roadmap.map((item) => (
            <article key={`${item.horizon}-${item.skill}`} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">{item.horizon}</p>
                  <h4 className="mt-2 text-lg font-bold text-slate-950">{item.skill}</h4>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{item.priority}</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.reason}</p>
              <p className="mt-3 text-sm font-semibold text-slate-800">Impacto esperado: {item.expectedImpact}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
      <h5 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-700">{title}</h5>
      <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
