import { BarChart3, FileText, Lightbulb, LogOut, Menu, Sparkles, UserCircle2, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import ThemeToggle from "../ui/ThemeToggle";

interface AppShellProps {
  email: string;
  onSignOut: () => void;
  children: ReactNode;
}

const navItems = [
  { label: "Perfil", icon: UserCircle2 },
  { label: "Posts", icon: FileText },
  { label: "Ideas", icon: Lightbulb },
  { label: "Career Growth", icon: BarChart3 },
  { label: "Skill Gap", icon: Sparkles },
];

export default function AppShell({ email, onSignOut, children }: AppShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navContent = (
    <nav className="space-y-2">
      {navItems.map(({ label, icon: Icon }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-[1.4rem] border px-4 py-3 text-sm font-semibold"
          style={{
            borderColor: "var(--border)",
            background: "color-mix(in srgb, var(--panel-strong) 70%, transparent)",
            color: "var(--text-primary)",
          }}
        >
          <Icon className="h-4 w-4" style={{ color: "var(--accent)" }} />
          {label}
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-40 px-4 pt-4 lg:hidden">
        <div
          className="mx-auto flex max-w-7xl items-center justify-between rounded-[1.6rem] px-4 py-3 backdrop-blur-xl"
          style={{ background: "var(--topbar)", border: "1px solid var(--border)" }}
        >
          <div>
            <p className="eyebrow">Career LinkedIn Copilot</p>
            <p className="mt-1 text-xs text-muted">Workspace profesional responsive</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setIsMobileNavOpen((current) => !current)}
              aria-label="Abrir navegación"
            >
              <span className="theme-toggle__icon">
                {isMobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </span>
            </button>
          </div>
        </div>
        {isMobileNavOpen && (
          <div className="mobile-nav-sheet mx-auto mt-3 max-w-7xl p-4">
            <div className="space-y-5">
              {navContent}
              <div className="soft-card p-4">
                <p className="eyebrow">Sesión activa</p>
                <p className="mt-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{email}</p>
                <button type="button" className="btn-secondary mt-4 w-full gap-2" onClick={onSignOut}>
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-5 lg:grid-cols-[300px_1fr] lg:px-6">
        <aside className="surface hidden flex-col justify-between p-6 lg:flex">
          <div className="space-y-8">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Career LinkedIn Copilot</p>
                  <h1 className="mt-4 font-display text-3xl" style={{ color: "var(--text-primary)" }}>
                    Tu sistema de crecimiento profesional.
                  </h1>
                </div>
                <ThemeToggle />
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">
                Desde una sola vista puedes construir marca personal, producir contenido y priorizar habilidades.
              </p>
            </div>

            {navContent}
          </div>

          <div className="surface-hero space-y-4 p-5 text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--accent-strong)" }}>Sesión activa</p>
              <p className="mt-2 text-sm font-semibold">{email}</p>
            </div>
            <button type="button" className="btn-secondary w-full gap-2" onClick={onSignOut}>
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="space-y-6 py-1 lg:pt-1">{children}</main>
      </div>
    </div>
  );
}
