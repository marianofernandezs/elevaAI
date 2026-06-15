import { AlertTriangle, LogOut, Save, Settings, Shield, Sparkles, UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { defaultUserSettings, loadUserSettings, saveUserSettings } from "../services/settingsService";
import type { UserSettings } from "../types";

const localSettingsKey = "career-linkedin-copilot-settings";

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof UserCircle2;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="surface p-6 md:p-7">
      <div className="flex items-start gap-4">
        <div
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {title}
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input
        className="input"
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={(event) => onChange?.(event.target.value)}
      />
    </label>
  );
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly { label: string; value: T }[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <select className="input" value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function SettingsPage() {
  const { isAuthenticated, userId, userEmail, signOut } = useAuth();
  const { setTheme } = useTheme();
  const [localSettings, setLocalSettings] = useLocalStorage<UserSettings>(localSettingsKey, defaultUserSettings);
  const [settings, setSettings] = useState<UserSettings>(localSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function bootstrap() {
      if (!userId) {
        if (!ignore) {
          setIsLoading(false);
        }
        return;
      }

      if (userId === "local-user") {
        if (!ignore) {
          setSettings(localSettings);
          setIsLoading(false);
        }
        return;
      }

      try {
        const loadedSettings = await loadUserSettings(userId);
        if (!ignore) {
          setSettings(loadedSettings);
          setLocalSettings(loadedSettings);
        }
      } catch (nextError) {
        if (!ignore) {
          setError(nextError instanceof Error ? nextError.message : "No pudimos cargar tu configuración.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void bootstrap();

    return () => {
      ignore = true;
    };
  }, [localSettings, setLocalSettings, userId]);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  async function handleSave() {
    setIsSaving(true);
    setFeedback("");
    setError("");

    try {
      setLocalSettings(settings);
      setTheme(settings.theme);

      if (userId && userId !== "local-user") {
        await saveUserSettings(userId, settings);
      }

      setFeedback("Configuración guardada correctamente.");
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "No pudimos guardar tu configuración. Intenta nuevamente.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppShell email={userEmail} onSignOut={signOut}>
      <div className="space-y-6">
        <div className="surface min-w-0 overflow-hidden">
          <div className="grid min-w-0 gap-5 p-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-center">
            <div>
              <p className="eyebrow">Configuración</p>
              <h1 className="mt-3 text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
                Ajusta tu cuenta y tus preferencias de elevaAI
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted">
                Aquí controlas cómo responde la IA, cómo quieres trabajar LinkedIn, tu apariencia y acciones de seguridad.
              </p>
            </div>
            {feedback ? (
              <div className="soft-card min-w-0 p-5 text-sm font-semibold" style={{ color: "var(--accent)" }}>
                {feedback}
              </div>
            ) : error ? (
              <div className="soft-card min-w-0 p-5 text-sm font-semibold text-red-500">
                {error}
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-6">
          <Section
            icon={UserCircle2}
            title="Cuenta"
            description="Edita la información básica de tu cuenta. El email es solo lectura por ahora."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Nombre visible"
                value={settings.displayName}
                placeholder="Ej: Mariano Fernandez"
                onChange={(value) => setSettings((current) => ({ ...current, displayName: value }))}
              />
              <Field label="Email" value={userEmail} readOnly />
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-[140px_minmax(0,1fr)] md:items-center">
              <div
                className="inline-flex h-24 w-24 items-center justify-center rounded-[2rem] border"
                style={{ borderColor: "var(--border)", background: "var(--panel-muted)", color: "var(--text-secondary)" }}
              >
                Avatar
              </div>
              <div className="soft-card p-4 text-sm text-muted">
                La foto de perfil quedará preparada para una siguiente iteración. Por ahora puedes usar tu nombre visible como referencia principal.
              </div>
            </div>
          </Section>

          <Section
            icon={Sparkles}
            title="Preferencias de IA"
            description="Controla el idioma, el tono y el nivel de detalle con el que quieres que elevaAI trabaje contigo."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <SelectField
                label="Idioma preferido"
                value={settings.preferredLanguage}
                options={[{ label: "Español", value: "Español" }] as const}
                onChange={(value) => setSettings((current) => ({ ...current, preferredLanguage: value }))}
              />
              <Field
                label="Tono de respuesta preferido"
                value={settings.preferredAiTone}
                placeholder="Ej: Profesional, claro y accionable"
                onChange={(value) => setSettings((current) => ({ ...current, preferredAiTone: value }))}
              />
              <SelectField
                label="Nivel de detalle"
                value={settings.responseDetailLevel}
                options={[
                  { label: "Breve", value: "brief" },
                  { label: "Normal", value: "normal" },
                  { label: "Detallado", value: "detailed" },
                ] as const}
                onChange={(value) => setSettings((current) => ({ ...current, responseDetailLevel: value }))}
              />
              <SelectField
                label="Objetivo principal"
                value={settings.mainGoal}
                options={[
                  { label: "Conseguir empleo", value: "Conseguir empleo" },
                  { label: "Atraer clientes", value: "Atraer clientes" },
                  { label: "Construir autoridad", value: "Construir autoridad" },
                  { label: "Networking", value: "Networking" },
                  { label: "Aprender nuevas habilidades", value: "Aprender nuevas habilidades" },
                ] as const}
                onChange={(value) => setSettings((current) => ({ ...current, mainGoal: value }))}
              />
            </div>
          </Section>

          <Section
            icon={Settings}
            title="Preferencias de LinkedIn"
            description="Define la frecuencia, el estilo y el tipo de CTA que prefieres para tu contenido."
          >
            <div className="grid gap-5 md:grid-cols-3">
              <SelectField
                label="Frecuencia objetivo de publicación"
                value={settings.linkedinFrequency}
                options={[
                  { label: "1 vez por semana", value: "1 vez por semana" },
                  { label: "2 veces por semana", value: "2 veces por semana" },
                  { label: "3 veces por semana", value: "3 veces por semana" },
                  { label: "Diario", value: "Diario" },
                ] as const}
                onChange={(value) => setSettings((current) => ({ ...current, linkedinFrequency: value }))}
              />
              <SelectField
                label="Estilo de contenido favorito"
                value={settings.favoriteContentStyle}
                options={[
                  { label: "Storytelling", value: "Storytelling" },
                  { label: "Técnico", value: "Técnico" },
                  { label: "Educativo", value: "Educativo" },
                  { label: "Opinión", value: "Opinión" },
                  { label: "Experiencias personales", value: "Experiencias personales" },
                ] as const}
                onChange={(value) => setSettings((current) => ({ ...current, favoriteContentStyle: value }))}
              />
              <SelectField
                label="CTA preferido"
                value={settings.preferredCtaStyle}
                options={[
                  { label: "Suave", value: "Suave" },
                  { label: "Directo", value: "Directo" },
                  { label: "Sin CTA", value: "Sin CTA" },
                ] as const}
                onChange={(value) => setSettings((current) => ({ ...current, preferredCtaStyle: value }))}
              />
            </div>
          </Section>

          <Section
            icon={Sparkles}
            title="Apariencia"
            description="Define cómo quieres que se vea la app. Esta preferencia se guarda localmente y también puede persistirse en tu configuración."
          >
            <div className="grid gap-5 md:grid-cols-3">
              <SelectField
                label="Tema"
                value={settings.theme}
                options={[
                  { label: "Claro", value: "light" },
                  { label: "Oscuro", value: "dark" },
                  { label: "Sistema", value: "system" },
                ] as const}
                onChange={(value) => setSettings((current) => ({ ...current, theme: value }))}
              />
            </div>
          </Section>

          <Section
            icon={Shield}
            title="Zona de seguridad"
            description="Acciones sensibles relacionadas con tu sesión y con futuras capacidades de administración de cuenta."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <button type="button" className="btn-secondary gap-2 justify-center" onClick={() => void signOut()}>
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
              <button
                type="button"
                className="btn-secondary gap-2 justify-center opacity-60"
                disabled
              >
                <AlertTriangle className="h-4 w-4" />
                Eliminar cuenta
              </button>
            </div>
          </Section>

          <div className="flex justify-end">
            <button type="button" className="btn-primary gap-2" onClick={() => void handleSave()} disabled={isSaving || isLoading}>
              <Save className="h-4 w-4" />
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
