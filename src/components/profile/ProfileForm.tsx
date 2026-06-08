import { useEffect, useState } from "react";
import type { UserProfile } from "../../types";

interface ProfileFormProps {
  profile: UserProfile;
  onChange: (profile: UserProfile) => Promise<void> | void;
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

export default function ProfileForm({ profile, onChange }: ProfileFormProps) {
  const [draft, setDraft] = useState(profile);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  return (
    <section className="surface p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-950">Perfil profesional</h3>
          <p className="mt-2 text-sm text-slate-600">
            Este contexto alimenta tus prompts, recomendaciones y análisis.
          </p>
        </div>
        <div className="rounded-full bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700">
          Español-first
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.key}>
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

      <button type="button" className="btn-primary mt-6" onClick={() => void onChange(draft)}>
        Guardar perfil
      </button>
    </section>
  );
}
