export const userFacingMessages = {
  workspace: {
    connecting: "Estamos preparando tu workspace personalizado.",
    localMode: "Modo local activo. Puedes explorar la experiencia y refinar tu perfil más adelante.",
    ready: "Tu workspace está listo. Ya puedes crear contenido, revisar tu perfil y avanzar con acciones concretas.",
    profileSaved: "Guardamos tu perfil correctamente.",
    analysisSaved: "Tu diagnóstico base quedó listo para seguir trabajando.",
    postCreated: "Tu nuevo post ya está listo para revisarlo.",
    postDeleted: "El post se eliminó correctamente.",
    ideasRefreshed: "Actualizamos tus ideas de contenido.",
    assessmentSaved: "Tu análisis de skills y roadmap quedaron actualizados.",
    resumeUploaded: "Tu CV se subió y ya quedó listo para analizar.",
    uploadRequiresSession: "Para subir tu CV necesitamos una sesión activa. Puedes seguir avanzando en otras partes mientras tanto.",
    initialIntent: "Perfecto. Empecemos creando tu primer post de posicionamiento para LinkedIn.",
  },
  onboarding: {
    saving: "Estamos guardando tu perfil para preparar tu diagnóstico inicial.",
    helpFallback: "Solo necesitamos una idea general para comenzar. Luego podrás mejorar esta respuesta con ayuda de la IA.",
    diagnosisError: "No pudimos preparar tu diagnóstico ahora mismo. Intenta nuevamente en unos segundos.",
    missingProfile: "Necesitamos completar tu perfil primero.",
  },
  settings: {
    saved: "Configuración guardada correctamente.",
    loadError: "No pudimos cargar tu configuración. Intenta nuevamente.",
    saveError: "No pudimos guardar tu configuración. Intenta nuevamente.",
  },
  dashboard: {
    loadError: "No pudimos cargar tu información por ahora. Reintenta en un momento.",
  },
  ai: {
    available: "La asistencia inteligente está disponible para ayudarte cuando la necesites.",
    unavailable: "La app seguirá ayudándote con sugerencias base mientras termina de preparar la asistencia avanzada.",
    checkError: "Hubo un problema al validar la asistencia inteligente, pero puedes seguir trabajando sin perder progreso.",
  },
} as const;

export function getGenericUserError(context: string) {
  const messages: Record<string, string> = {
    profile: "No pudimos guardar tu perfil. Intenta nuevamente.",
    post: "No pudimos completar esta acción con el post. Intenta otra vez.",
    ideas: "No pudimos actualizar tus ideas ahora mismo. Intenta nuevamente.",
    resume: "No pudimos procesar tu CV en este momento. Intenta otra vez.",
    assessment: "No pudimos actualizar tu análisis por ahora. Intenta nuevamente.",
    settings: userFacingMessages.settings.saveError,
    workspace: userFacingMessages.dashboard.loadError,
  };

  return messages[context] ?? "No pudimos completar esta acción por ahora. Intenta nuevamente.";
}
