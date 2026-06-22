const debugEnvEnabled = String(import.meta.env.VITE_ENABLE_DEBUG_PANEL ?? "").toLowerCase() === "true";

export function isDebugModeEnabled() {
  return import.meta.env.DEV || debugEnvEnabled;
}

export function debugLog(message: string, metadata?: unknown) {
  if (!isDebugModeEnabled()) {
    return;
  }

  console.info(`[elevaAI debug] ${message}`, metadata ?? "");
}

export function debugWarn(message: string, metadata?: unknown) {
  if (!isDebugModeEnabled()) {
    return;
  }

  console.warn(`[elevaAI debug] ${message}`, metadata ?? "");
}

export function debugError(message: string, metadata?: unknown) {
  if (!isDebugModeEnabled()) {
    return;
  }

  console.error(`[elevaAI debug] ${message}`, metadata ?? "");
}
