import { useEffect, useState } from "react";
import type { UserProfile } from "../../types";

interface ProfileFormProps {
  profile: UserProfile;
  onChange: (profile: UserProfile) => Promise<void> | void;
  hideHeader?: boolean;
}

const fields: Array<{ key: keyof UserProfile; label: string; type?: string }> = [
  { key: "fullName", label: "Nombre completo" },
  { key: "profession", label: "Profesión" },
  { key: "industry", label: "Industria" },
  { key: "country", label: "País" },
  { key: "yearsOfExperience", label: "Años de experiencia", type: "number" },
  { key: "targetAudience", label: "Audiencia objetivo" },
  { key: "careerGoal", label: "Objetivo profesional" },
  { key: "personalBrandGoal", label: "Objetivo de marca personal" },
  { key: "communicationStyle", label: "Estilo de comunicación" },
  { key: "contentTopics", label: "Temas de contenido" },
  { key: "linkedInUrl", label: "URL de LinkedIn", type: "url" },
];

export default function ProfileForm({ profile, onChange, hideHeader = false }: ProfileFormProps) {
  const [draft, setDraft] = useState(profile);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  return (
    <section className="surface min-w-0 p-6">
      {!hideHeader && (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Perfil profesional</h3>
            <p className="mt-2 text-sm text-muted">
              Este contexto alimenta tus prompts, recomendaciones y análisis.
            </p>
          </div>
          <div className="badge-pill">Español-first</div>
        </div>
      )}

      <div className="grid min-w-0 gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.key} className="min-w-0">
            <span className="label">{field.label}</span>
            <input
              className="input"
              type={field.type ?? "text"}
              value={draft[field.key]}
              onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })}
            />
          </label>
        ))}
      </div>

      <button type="button" className="btn-primary mt-6 w-full sm:w-auto" onClick={() => void onChange(draft)}>
        Guardar perfil
      </button>
    </section>
  );
}
