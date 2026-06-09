import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useAuth } from "../contexts/AuthContext";
import { useWorkspaceData } from "../hooks/useWorkspaceData";
import type { UserProfile } from "../types";

type OnboardingStep = 0 | 1 | 2;

const stepMeta = [
  {
    eyebrow: "Paso 1",
    title: "Quién eres",
    description: "Cuéntale al agente quién eres profesionalmente y desde qué contexto hablas.",
    fields: ["fullName", "profession", "industry", "country", "yearsOfExperience"] as const,
  },
  {
    eyebrow: "Paso 2",
    title: "Qué quieres lograr",
    description: "Aterrizamos tu objetivo profesional y el tipo de oportunidades que quieres atraer.",
    fields: ["targetAudience", "careerGoal", "linkedInUrl"] as const,
  },
  {
    eyebrow: "Paso 3",
    title: "Cómo quieres posicionarte",
    description: "Definimos la voz, el enfoque y los temas con los que elevaIA va a construir tu presencia.",
    fields: ["personalBrandGoal", "communicationStyle", "contentTopics"] as const,
  },
] satisfies Array<{
  eyebrow: string;
  title: string;
  description: string;
  fields: ReadonlyArray<keyof UserProfile>;
}>;

const optionalFields: Array<keyof UserProfile> = ["linkedInUrl"];

function isStepValid(step: OnboardingStep, profile: UserProfile) {
  return stepMeta[step].fields.every((field) => {
    if (optionalFields.includes(field)) {
      return true;
    }

    return profile[field].trim().length > 0;
  });
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  optional = false,
  multiline = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
  placeholder: string;
  optional?: boolean;
  multiline?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="label">
        {label}
        {optional ? " (opcional)" : ""}
      </span>
      {multiline ? (
        <textarea
          className="input min-h-[132px] resize-y"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className="input"
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { state, isLoading, profileComplete, saveProfile } = useWorkspaceData();
  const [step, setStep] = useState<OnboardingStep>(0);
  const [profile, setProfile] = useState<UserProfile>(state.profile);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = useMemo(() => ((step + 1) / stepMeta.length) * 100, [step]);

  useEffect(() => {
    setProfile(state.profile);
  }, [state.profile]);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!isLoading && profileComplete) {
    return <Navigate to="/profile-analysis-loading" replace />;
  }

  async function handleNext() {
    if (step < 2) {
      setStep((current) => (current + 1) as OnboardingStep);
      return;
    }

    setIsSubmitting(true);
    try {
      await saveProfile(profile);
      navigate("/profile-analysis-loading", { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto mb-6 flex max-w-6xl justify-end">
        <ThemeToggle />
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="surface-hero p-8 text-white md:p-10">
          <p className="eyebrow text-white/70">{stepMeta[step].eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl md:text-5xl">Perfil profesional</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/72">
            Este contexto alimenta tus prompts, recomendaciones y análisis. El onboarding es obligatorio para que elevaIA piense como tu agente de crecimiento profesional.
          </p>

          <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-8 space-y-4">
            {stepMeta.map((item, index) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${index <= step ? "bg-white text-slate-900" : "bg-white/10 text-white/60"}`}>
                    {index < step ? <Check className="h-4 w-4" /> : index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-sm text-white/60">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="surface p-6 md:p-8">
          <p className="eyebrow">{stepMeta[step].eyebrow}</p>
          <h2 className="mt-4 text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            {stepMeta[step].title}
          </h2>
          <p className="mt-3 text-base leading-7 text-muted">{stepMeta[step].description}</p>

          <div className="mt-8 space-y-5">
            {step === 0 && (
              <>
                <Field
                  label="Nombre completo"
                  value={profile.fullName}
                  placeholder="Ej: Mariano Simón Fernandez"
                  onChange={(value) => setProfile((current) => ({ ...current, fullName: value }))}
                />
                <Field
                  label="Profesión"
                  value={profile.profession}
                  placeholder="Ej: Ingeniero Civil Informático"
                  onChange={(value) => setProfile((current) => ({ ...current, profession: value }))}
                />
                <Field
                  label="Industria"
                  value={profile.industry}
                  placeholder="Ej: Software"
                  onChange={(value) => setProfile((current) => ({ ...current, industry: value }))}
                />
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="País"
                    value={profile.country}
                    placeholder="Ej: Chile"
                    onChange={(value) => setProfile((current) => ({ ...current, country: value }))}
                  />
                  <Field
                    label="Años de experiencia"
                    value={profile.yearsOfExperience}
                    placeholder="Ej: 3"
                    type="number"
                    onChange={(value) => setProfile((current) => ({ ...current, yearsOfExperience: value }))}
                  />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <Field
                  label="Audiencia objetivo"
                  value={profile.targetAudience}
                  placeholder="Ej: Recruiters, líderes técnicos, profesionales de tecnología"
                  multiline
                  onChange={(value) => setProfile((current) => ({ ...current, targetAudience: value }))}
                />
                <Field
                  label="Objetivo profesional"
                  value={profile.careerGoal}
                  placeholder="Ej: Posicionarme en la industria del software"
                  multiline
                  onChange={(value) => setProfile((current) => ({ ...current, careerGoal: value }))}
                />
                <Field
                  label="URL de LinkedIn"
                  value={profile.linkedInUrl}
                  placeholder="https://www.linkedin.com/in/..."
                  optional
                  onChange={(value) => setProfile((current) => ({ ...current, linkedInUrl: value }))}
                />
              </>
            )}

            {step === 2 && (
              <>
                <Field
                  label="Objetivo de marca personal"
                  value={profile.personalBrandGoal}
                  placeholder="Ej: Publicar contenido consistente que atraiga oportunidades"
                  multiline
                  onChange={(value) => setProfile((current) => ({ ...current, personalBrandGoal: value }))}
                />
                <Field
                  label="Estilo de comunicación"
                  value={profile.communicationStyle}
                  placeholder="Ej: Cercano, estratégico y accionable"
                  multiline
                  onChange={(value) => setProfile((current) => ({ ...current, communicationStyle: value }))}
                />
                <Field
                  label="Temas de contenido"
                  value={profile.contentTopics}
                  placeholder="Ej: Desarrollo de software, IA, carrera profesional"
                  multiline
                  onChange={(value) => setProfile((current) => ({ ...current, contentTopics: value }))}
                />
              </>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setStep((current) => Math.max(0, current - 1) as OnboardingStep)}
              disabled={step === 0 || isSubmitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Anterior
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => void handleNext()}
              disabled={!isStepValid(step, profile) || isSubmitting}
            >
              {step === 2 ? "Analizar mi perfil" : "Continuar"}
              {step < 2 && <ArrowRight className="ml-2 h-4 w-4" />}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
