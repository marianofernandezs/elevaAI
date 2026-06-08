import * as Sentry from "@sentry/react";

export function initSentry() {
  const dsn = (import.meta.env as Record<string, string | undefined>).SENTRY_DSN;

  if (!dsn) {
    return;
  }

  Sentry.init({
    dsn,
    tracesSampleRate: 0.2,
    integrations: [],
  });
}

export function captureAppError(error: unknown, context?: Record<string, unknown>) {
  if (!(import.meta.env as Record<string, string | undefined>).SENTRY_DSN) {
    return;
  }

  Sentry.captureException(error, {
    extra: context,
  });
}
