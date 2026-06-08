import { BarChart3, FileText, Lightbulb, LogOut, Sparkles, UserCircle2 } from "lucide-react";
import type { ReactNode } from "react";

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
  return (
    <div className="min-h-screen bg-sand">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-5 lg:grid-cols-[280px_1fr] lg:px-6">
        <aside className="surface flex flex-col justify-between p-6">
          <div className="space-y-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">Career LinkedIn Copilot</p>
              <h1 className="mt-4 font-display text-3xl text-slate-950">Tu sistema de crecimiento profesional.</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Desde una sola vista puedes construir marca personal, producir contenido y priorizar habilidades.
              </p>
            </div>

            <nav className="space-y-2">
              {navItems.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  <Icon className="h-4 w-4 text-amber-600" />
                  {label}
                </div>
              ))}
            </nav>
          </div>

          <div className="space-y-4 rounded-3xl bg-slate-950 p-5 text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Sesión activa</p>
              <p className="mt-2 text-sm font-semibold">{email}</p>
            </div>
            <button type="button" className="btn-secondary w-full gap-2" onClick={onSignOut}>
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="space-y-6 py-1">{children}</main>
      </div>
    </div>
  );
}
