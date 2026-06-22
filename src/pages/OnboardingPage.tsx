import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import OnboardingAssistant from "../components/onboarding/OnboardingAssistant";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useAuth } from "../contexts/AuthContext";
import { useWorkspaceData } from "../hooks/useWorkspaceData";
import {
  buildOnboardingHelpRequest,
  getOnboardingHelp,
  type OnboardingHelpResponse,
} from "../services/onboardingAssistantService";
import type { UserProfile } from "../types";
import { userFacingMessages } from "../utils/userFacingMessages";

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
  onHelp,
  name,
}: {
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
  placeholder: string;
  optional?: boolean;
  multiline?: boolean;
  type?: string;
  onHelp: () => void;
  name?: string;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between gap-3">
        <span className="label !mb-0 flex items-center gap-1.5">
          {label}
          {optional ? (
            <span className="text-xs font-normal text-tertiary">(opcional)</span>
          ) : null}
        </span>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-strong transition-colors duration-150 cursor-pointer"
          onClick={onHelp}
        >
          <Sparkles className="h-3 w-3" />
          Ayuda de IA
        </button>
      </div>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          className="input mt-2 min-h-[132px] resize-y"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          id={name}
          name={name}
          className="input mt-2"
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
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantTitle, setAssistantTitle] = useState("Selecciona una pregunta para recibir ayuda");
  const [assistantField, setAssistantField] = useState<keyof UserProfile | null>(null);
  const [assistantHelp, setAssistantHelp] = useState<OnboardingHelpResponse | null>(null);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const progress = useMemo(() => ((step + 1) / stepMeta.length) * 100, [step]);

  useEffect(() => {
    setProfile((current) => {
      const next = { ...current };
      let changed = false;
      for (const k of Object.keys(state.profile) as Array<keyof UserProfile>) {
        if (!current[k] && state.profile[k]) {
          next[k] = state.profile[k];
          changed = true;
        }
      }
      return changed ? next : current;
    });
  }, [state.profile]);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  async function openAssistant(field: keyof UserProfile, label: string, userFocus?: string) {
    setAssistantOpen(true);
    setAssistantField(field);
    setAssistantTitle(label);
    setIsAssistantLoading(true);

    try {
      const help = await getOnboardingHelp(buildOnboardingHelpRequest(field, profile, userFocus));
      setAssistantHelp(help);
    } catch {
      setAssistantHelp({
        explanation: userFacingMessages.onboarding.helpFallback,
        examples: ["Escribe una idea simple y la refinamos después."],
      });
    } finally {
      setIsAssistantLoading(false);
    }
  }

  async function suggestFieldValue(field: keyof UserProfile, label: string, userFocus?: string) {
    await openAssistant(field, label, userFocus);
  }

  function applyAssistantSuggestion() {
    if (!assistantField || !assistantHelp?.suggestion) {
      return;
    }

    setProfile((current) => ({
      ...current,
      [assistantField]: assistantHelp.suggestion ?? current[assistantField],
    }));
  }

  async function handleNext() {
    if (step < 2) {
      setStep((current) => (current + 1) as OnboardingStep);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await saveProfile(profile);
      navigate("/profile-analysis-loading", { replace: true });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Hubo un error al procesar tu perfil. Por favor, intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto mb-6 flex max-w-6xl justify-end">
        <ThemeToggle />
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr_0.8fr]">
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
            {stepMeta.map((item, index) => {
              const isActive = index === step;
              const isCompleted = index < step;
              return (
                <div
                  key={item.title}
                  className={`rounded-[1.5rem] border transition-all duration-300 px-5 py-4 ${
                    isActive
                      ? "border-white/25 bg-white/10 shadow-lg shadow-black/10 scale-[1.02]"
                      : isCompleted
                      ? "border-white/10 bg-white/5 opacity-80"
                      : "border-white/5 bg-transparent opacity-45"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                        isActive
                          ? "bg-white text-slate-900 ring-4 ring-white/10"
                          : isCompleted
                          ? "bg-emerald-500 text-white"
                          : "bg-white/10 text-white/60"
                      }`}
                    >
                      {isCompleted ? <Check className="h-4 w-4 stroke-[3px]" /> : index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="text-xs text-white/60 mt-0.5">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="surface p-6 md:p-8">
          <p className="eyebrow">{stepMeta[step].eyebrow}</p>
          <h2 className="mt-4 text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            {stepMeta[step].title}
          </h2>
          <p className="mt-3 text-base leading-7 text-muted">{stepMeta[step].description}</p>
          
          <div className="mt-4 flex gap-3 rounded-[1.25rem] border border-accent/10 bg-accent-soft p-4 text-sm leading-relaxed text-muted">
            <Sparkles className="h-5 w-5 shrink-0 text-accent" />
            <div>
              <span className="font-semibold text-accent-strong">Consejo:</span> No te preocupes si no tienes una respuesta perfecta. La IA te ayudará a definir cada campo y podrás editarlo cuando quieras.
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {step === 0 && (
              <>
                <Field
                  name="fullName"
                  label="Nombre completo"
                  value={profile.fullName}
                  placeholder="Ej: Mariano Simón Fernandez"
                  onChange={(value) => setProfile((current) => ({ ...current, fullName: value }))}
                  onHelp={() => void openAssistant("fullName", "Nombre completo")}
                />
                <Field
                  name="profession"
                  label="Profesión"
                  value={profile.profession}
                  placeholder="Ej: Ingeniero Civil Informático"
                  onChange={(value) => setProfile((current) => ({ ...current, profession: value }))}
                  onHelp={() => void openAssistant("profession", "Profesión")}
                />
                <Field
                  name="industry"
                  label="Industria"
                  value={profile.industry}
                  placeholder="Ej: Software"
                  onChange={(value) => setProfile((current) => ({ ...current, industry: value }))}
                  onHelp={() => void openAssistant("industry", "Industria")}
                />
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    name="country"
                    label="País"
                    value={profile.country}
                    placeholder="Ej: Chile"
                    onChange={(value) => setProfile((current) => ({ ...current, country: value }))}
                    onHelp={() => void openAssistant("country", "País")}
                  />
                  <Field
                    name="yearsOfExperience"
                    label="Años de experiencia"
                    value={profile.yearsOfExperience}
                    placeholder="Ej: 3"
                    type="number"
                    onChange={(value) => setProfile((current) => ({ ...current, yearsOfExperience: value }))}
                    onHelp={() => void openAssistant("yearsOfExperience", "Años de experiencia")}
                  />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <Field
                  name="targetAudience"
                  label="Audiencia objetivo"
                  value={profile.targetAudience}
                  placeholder="Ej: Recruiters, líderes técnicos, profesionales de tecnología"
                  multiline
                  onChange={(value) => setProfile((current) => ({ ...current, targetAudience: value }))}
                  onHelp={() => void openAssistant("targetAudience", "Audiencia objetivo")}
                />
                <Field
                  name="careerGoal"
                  label="Objetivo profesional"
                  value={profile.careerGoal}
                  placeholder="Ej: Posicionarme en la industria del software"
                  multiline
                  onChange={(value) => setProfile((current) => ({ ...current, careerGoal: value }))}
                  onHelp={() => void openAssistant("careerGoal", "Objetivo profesional")}
                />
                <Field
                  name="linkedInUrl"
                  label="URL de LinkedIn"
                  value={profile.linkedInUrl}
                  placeholder="https://www.linkedin.com/in/..."
                  optional
                  onChange={(value) => setProfile((current) => ({ ...current, linkedInUrl: value }))}
                  onHelp={() => void openAssistant("linkedInUrl", "URL de LinkedIn")}
                />
              </>
            )}

            {step === 2 && (
              <>
                <Field
                  name="personalBrandGoal"
                  label="Objetivo de marca personal"
                  value={profile.personalBrandGoal}
                  placeholder="Ej: Publicar contenido consistente que atraiga oportunidades"
                  multiline
                  onChange={(value) => setProfile((current) => ({ ...current, personalBrandGoal: value }))}
                  onHelp={() => void openAssistant("personalBrandGoal", "Objetivo de marca personal")}
                />
                <Field
                  name="communicationStyle"
                  label="Estilo de comunicación"
                  value={profile.communicationStyle}
                  placeholder="Ej: Cercano, estratégico y accionable"
                  multiline
                  onChange={(value) => setProfile((current) => ({ ...current, communicationStyle: value }))}
                  onHelp={() => void openAssistant("communicationStyle", "Estilo de comunicación")}
                />
                <Field
                  name="contentTopics"
                  label="Temas de contenido"
                  value={profile.contentTopics}
                  placeholder="Ej: Desarrollo de software, IA, carrera profesional"
                  multiline
                  onChange={(value) => setProfile((current) => ({ ...current, contentTopics: value }))}
                  onHelp={() => void openAssistant("contentTopics", "Temas de contenido")}
                />
              </>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
            {submitError && (
              <div className="w-full rounded-xl bg-red-500/10 p-3 text-sm text-red-500 mb-4 sm:mb-0 sm:col-span-2">
                {submitError}
              </div>
            )}
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
              {step === 2 ? (isSubmitting ? "Guardando..." : "Analizar mi perfil") : "Continuar"}
              {step < 2 && <ArrowRight className="ml-2 h-4 w-4" />}
            </button>
          </div>
        </section>

        <OnboardingAssistant
          isOpen={assistantOpen}
          onClose={() => setAssistantOpen(false)}
          isLoading={isAssistantLoading}
          title={assistantTitle}
          help={assistantHelp}
          hasSuggestion={Boolean(assistantHelp?.suggestion)}
          onRequestSuggestion={() => {
            if (!assistantField) {
              return;
            }
            void suggestFieldValue(assistantField, assistantTitle);
          }}
          onApplySuggestion={applyAssistantSuggestion}
          onApplyValue={(value) => {
            if (!assistantField) return;
            setProfile((current) => ({
              ...current,
              [assistantField]: value,
            }));
          }}
        />
      </div>

      {!assistantOpen ? (
        <div className="mx-auto mt-4 max-w-7xl lg:hidden">
          <button type="button" className="btn-secondary w-full justify-center gap-2" onClick={() => setAssistantOpen(true)}>
            <Sparkles className="h-4 w-4" />
            Ayúdame con esto
          </button>
        </div>
      ) : null}
    </div>
  );
}
