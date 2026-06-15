import { captureAppError } from "../lib/sentry";
import { hasSupabaseEnv, supabase } from "../lib/supabase";
import type { UserSettings } from "../types";

function ensureSupabase() {
  if (!hasSupabaseEnv || !supabase) {
    throw new Error("Supabase no está configurado correctamente.");
  }

  return supabase;
}

export const defaultUserSettings: UserSettings = {
  displayName: "",
  preferredLanguage: "Español",
  preferredAiTone: "Profesional y cercano",
  responseDetailLevel: "normal",
  mainGoal: "Construir autoridad",
  linkedinFrequency: "2 veces por semana",
  favoriteContentStyle: "Educativo",
  preferredCtaStyle: "Suave",
  theme: "system",
};

function mapSettingsRecord(record: Record<string, unknown> | null | undefined): UserSettings {
  if (!record) {
    return defaultUserSettings;
  }

  return {
    displayName: String(record.display_name ?? defaultUserSettings.displayName),
    preferredLanguage: String(record.preferred_language ?? defaultUserSettings.preferredLanguage),
    preferredAiTone: String(record.preferred_ai_tone ?? defaultUserSettings.preferredAiTone),
    responseDetailLevel:
      (record.response_detail_level as UserSettings["responseDetailLevel"] | undefined) ??
      defaultUserSettings.responseDetailLevel,
    mainGoal: (record.main_goal as UserSettings["mainGoal"] | undefined) ?? defaultUserSettings.mainGoal,
    linkedinFrequency:
      (record.linkedin_frequency as UserSettings["linkedinFrequency"] | undefined) ??
      defaultUserSettings.linkedinFrequency,
    favoriteContentStyle:
      (record.favorite_content_style as UserSettings["favoriteContentStyle"] | undefined) ??
      defaultUserSettings.favoriteContentStyle,
    preferredCtaStyle:
      (record.preferred_cta_style as UserSettings["preferredCtaStyle"] | undefined) ??
      defaultUserSettings.preferredCtaStyle,
    theme: (record.theme as UserSettings["theme"] | undefined) ?? defaultUserSettings.theme,
  };
}

export async function loadUserSettings(userId: string): Promise<UserSettings> {
  const client = ensureSupabase();
  const { data, error } = await client.from("user_settings").select("*").eq("user_id", userId).maybeSingle();

  if (error) {
    captureAppError(error, { scope: "settings:load" });
    throw new Error("No pudimos cargar tu configuración.");
  }

  return mapSettingsRecord(data as Record<string, unknown> | null | undefined);
}

export async function saveUserSettings(userId: string, settings: UserSettings) {
  const client = ensureSupabase();
  const { error } = await client.from("user_settings").upsert(
    {
      user_id: userId,
      display_name: settings.displayName,
      preferred_language: settings.preferredLanguage,
      preferred_ai_tone: settings.preferredAiTone,
      response_detail_level: settings.responseDetailLevel,
      main_goal: settings.mainGoal,
      linkedin_frequency: settings.linkedinFrequency,
      favorite_content_style: settings.favoriteContentStyle,
      preferred_cta_style: settings.preferredCtaStyle,
      theme: settings.theme,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    captureAppError(error, { scope: "settings:save" });
    throw new Error("No pudimos guardar tu configuración. Intenta nuevamente.");
  }
}
