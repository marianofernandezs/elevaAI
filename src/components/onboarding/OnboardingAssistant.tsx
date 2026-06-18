import { useEffect, useState } from "react";
import { Lightbulb, Sparkles, X } from "lucide-react";
import type { OnboardingHelpResponse } from "../../services/onboardingAssistantService";

interface OnboardingAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  title: string;
  help: OnboardingHelpResponse | null;
  onRequestSuggestion: (focus?: string) => void;
  onApplySuggestion: () => void;
  onApplyValue: (value: string) => void;
  hasSuggestion: boolean;
}

export default function OnboardingAssistant({
  isOpen,
  onClose,
  isLoading,
  title,
  help,
  onRequestSuggestion,
  onApplySuggestion,
  onApplyValue,
}: OnboardingAssistantProps) {
  const [customFocus, setCustomFocus] = useState("");

  useEffect(() => {
    setCustomFocus("");
  }, [title]);

  return (
    <aside
      className={`surface p-5 md:p-6 ${isOpen ? "block" : "hidden lg:block"} h-fit relative`}
      style={{
        borderColor: isOpen ? "color-mix(in srgb, var(--accent) 26%, var(--border))" : "var(--border)",
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-1.5 rounded-full text-muted hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer lg:hidden"
        aria-label="Cerrar asistente"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3">
        <div
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl animate-pulse"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          <Lightbulb className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="eyebrow">Asistente</p>
          <h3 className="mt-2 text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            ¿Necesitas ayuda?
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Puedo ayudarte a completar cada sección.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {isLoading ? (
          <div className="soft-card p-5 text-sm leading-relaxed text-muted flex items-center gap-3">
            <div className="h-4 w-4 rounded-full border-2 border-accent border-t-transparent animate-spin shrink-0" />
            <span>Preparando ideas y ejemplos para este campo...</span>
          </div>
        ) : help ? (
          <>
            <div className="rounded-[1.5rem] border px-4 py-4" style={{ borderColor: "var(--border)", background: "var(--panel-muted)" }}>
              <p className="text-xs font-semibold text-accent uppercase tracking-wider">
                Campo seleccionado
              </p>
              <p className="mt-1.5 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {title}
              </p>
            </div>

            <div className="soft-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-tertiary mb-1.5">
                Explicación
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {help.explanation}
              </p>
            </div>

            {help.suggestion && (
              <div className="rounded-[1.75rem] border border-accent/20 bg-accent-soft/30 p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5 mb-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  Sugerencia de la IA
                </p>
                <p className="text-sm italic leading-relaxed text-primary bg-panel/50 p-3 rounded-xl border border-accent/10">
                  "{help.suggestion}"
                </p>

                <div className="mt-4 border-t border-accent/10 pt-3">
                  <label className="text-[11px] font-semibold text-tertiary block mb-1.5">
                    ¿Quieres enfocar la sugerencia? (opcional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customFocus}
                      onChange={(e) => setCustomFocus(e.target.value)}
                      placeholder="Ej: remoto, startups, liderazgo..."
                      className="input !py-1.5 !px-3 !text-xs !rounded-xl"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          onRequestSuggestion(customFocus);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => onRequestSuggestion(customFocus)}
                      className="btn-secondary !py-1.5 !px-3 !text-xs !rounded-xl whitespace-nowrap cursor-pointer hover:bg-accent hover:text-white transition-all"
                    >
                      Enfocar
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-primary w-full mt-4 justify-center text-xs py-2 px-4 shadow-sm cursor-pointer"
                  onClick={onApplySuggestion}
                >
                  Usar sugerencia
                </button>
              </div>
            )}

            <div className="soft-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-tertiary mb-2">
                Ejemplos (clic para usar)
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {help.examples.map((example) => (
                  <button
                    key={example}
                    type="button"
                    className="badge-pill hover:bg-accent hover:text-white hover:scale-105 transition-all duration-150 cursor-pointer select-none normal-case tracking-normal py-1.5 px-3 border border-transparent hover:border-accent-strong"
                    onClick={() => onApplyValue(example)}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center p-6 bg-accent-soft/20 rounded-[1.75rem] border border-accent/10 mt-2">
            <div className="h-12 w-12 rounded-2xl bg-accent-soft text-accent flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-primary mb-2">Asistente elevaIA</h4>
            <p className="text-sm text-muted leading-relaxed">
              ¿No sabes qué responder? Haz clic en <strong className="text-accent font-semibold">Ayuda de IA</strong> en cualquier campo para cargar sugerencias y ejemplos prácticos basados en tu perfil.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

