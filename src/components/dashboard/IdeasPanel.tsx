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
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Generador de ideas</h3>
          <p className="mt-2 text-sm text-muted">Ideas accionables para storytelling, autoridad y empleabilidad.</p>
        </div>
        <button type="button" className="btn-secondary" onClick={handleRefresh} disabled={loading}>
          {loading ? "Actualizando..." : "Generar ideas"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ideas.map((idea) => (
          <article key={idea.id} className="soft-card p-5">
            <p className="eyebrow">{idea.pillar}</p>
            <h4 className="mt-3 text-lg font-bold" style={{ color: "var(--text-primary)" }}>{idea.title}</h4>
            <p className="mt-3 text-sm leading-7 text-muted">{idea.description}</p>
            <div className="badge-pill mt-4" style={{ letterSpacing: "0.02em", textTransform: "none" }}>
              {idea.angle}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
