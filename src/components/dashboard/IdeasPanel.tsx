import { useState } from "react";
import { generateIdeas } from "../../services/aiService";
import type { ContentIdea, UserProfile } from "../../types";

interface IdeasPanelProps {
  profile: UserProfile;
  ideas: ContentIdea[];
  onRefresh: (ideas: ContentIdea[]) => Promise<void> | void;
}

export default function IdeasPanel({ profile, ideas, onRefresh }: IdeasPanelProps) {
  const [loading, setLoading] = useState(false);

  async function handleRefresh() {
    setLoading(true);
    const nextIdeas = await generateIdeas(profile);
    onRefresh(nextIdeas);
    setLoading(false);
  }

  return (
    <section className="surface p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-slate-950">Generador de ideas</h3>
          <p className="mt-2 text-sm text-slate-600">Ideas accionables para storytelling, autoridad y empleabilidad.</p>
        </div>
        <button type="button" className="btn-secondary" onClick={handleRefresh} disabled={loading}>
          {loading ? "Actualizando..." : "Generar ideas"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ideas.map((idea) => (
          <article key={idea.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">{idea.pillar}</p>
            <h4 className="mt-3 text-lg font-bold text-slate-950">{idea.title}</h4>
            <p className="mt-3 text-sm leading-7 text-slate-600">{idea.description}</p>
            <div className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              {idea.angle}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
