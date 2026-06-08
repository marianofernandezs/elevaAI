import { useState } from "react";
import { generateHooks, generateLinkedInPost, rewriteContent } from "../../services/aiService";
import type { GeneratedPost, UserProfile } from "../../types";

interface PostGeneratorProps {
  profile: UserProfile;
  onPostCreated: (post: GeneratedPost) => void;
}

export default function PostGenerator({ profile, onPostCreated }: PostGeneratorProps) {
  const [baseIdea, setBaseIdea] = useState("Cómo convertir experiencia real en contenido que genere oportunidades");
  const [goal, setGoal] = useState("Aumentar autoridad");
  const [type, setType] = useState("Storytelling");
  const [length, setLength] = useState("Media");
  const [sourceText, setSourceText] = useState("Aprendí que publicar sin un mensaje claro desgasta mucho y construye poco.");
  const [hooks, setHooks] = useState<string[]>([]);
  const [rewrittenText, setRewrittenText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGeneratePost() {
    setLoading(true);
    const post = await generateLinkedInPost({ profile, baseIdea, goal, type, length });
    onPostCreated(post);
    setLoading(false);
  }

  async function handleGenerateHooks() {
    setLoading(true);
    const nextHooks = await generateHooks({ profile, topic: baseIdea });
    setHooks(nextHooks);
    setLoading(false);
  }

  async function handleRewrite() {
    setLoading(true);
    const result = await rewriteContent({ profile, sourceText });
    setRewrittenText(result);
    setLoading(false);
  }

  return (
    <section className="grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
      <div className="surface min-w-0 p-6">
        <div className="mb-5">
          <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Generador de posts LinkedIn</h3>
          <p className="mt-2 text-sm text-muted">
            Genera posts con hook, desarrollo, CTA y hashtags alineados a tu posicionamiento.
          </p>
        </div>

        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          <label className="min-w-0 md:col-span-2">
            <span className="label">Idea base</span>
            <textarea
              className="input min-h-28"
              value={baseIdea}
              onChange={(event) => setBaseIdea(event.target.value)}
            />
          </label>
          <label className="min-w-0">
            <span className="label">Objetivo</span>
            <select className="input" value={goal} onChange={(event) => setGoal(event.target.value)}>
              <option>Aumentar autoridad</option>
              <option>Generar oportunidades</option>
              <option>Conseguir empleo</option>
              <option>Captar clientes</option>
            </select>
          </label>
          <label className="min-w-0">
            <span className="label">Tipo de publicación</span>
            <select className="input" value={type} onChange={(event) => setType(event.target.value)}>
              <option>Storytelling</option>
              <option>Opinión</option>
              <option>Aprendizaje</option>
              <option>Caso de éxito</option>
              <option>Consejo práctico</option>
              <option>Networking</option>
              <option>Empleo</option>
              <option>Captación de clientes</option>
            </select>
          </label>
          <label className="min-w-0">
            <span className="label">Longitud</span>
            <select className="input" value={length} onChange={(event) => setLength(event.target.value)}>
              <option>Corta</option>
              <option>Media</option>
              <option>Larga</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={handleGeneratePost} disabled={loading}>
            {loading ? "Generando..." : "Generar post"}
          </button>
          <button type="button" className="btn-secondary" onClick={handleGenerateHooks} disabled={loading}>
            Generar 10 hooks
          </button>
        </div>
      </div>

      <div className="min-w-0 space-y-6">
        <div className="surface min-w-0 p-6">
          <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Reescritor de contenido</h3>
          <textarea
            className="input mt-4 min-h-36"
            value={sourceText}
            onChange={(event) => setSourceText(event.target.value)}
          />
          <button type="button" className="btn-secondary mt-4" onClick={handleRewrite} disabled={loading}>
            Reescribir
          </button>
          {rewrittenText && (
            <pre className="soft-card mt-4 whitespace-pre-wrap p-4 text-sm" style={{ color: "var(--text-secondary)" }}>
              {rewrittenText}
            </pre>
          )}
        </div>

        <div className="surface min-w-0 p-6">
          <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Hooks sugeridos</h3>
          <div className="mt-4 space-y-3">
            {hooks.length === 0 ? (
              <p className="text-sm text-soft">Genera hooks para desbloquear nuevas aperturas.</p>
            ) : (
              hooks.map((hook) => (
                <div key={hook} className="soft-card px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {hook}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
