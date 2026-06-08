import { ArrowRight, BrainCircuit, FileUp, LineChart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeading from "../components/ui/SectionHeading";
import ThemeToggle from "../components/ui/ThemeToggle";

const features = [
  {
    title: "Marca personal con estrategia",
    description: "Define tu posicionamiento, tu audiencia y un sistema de contenido coherente con tu objetivo profesional.",
    icon: Sparkles,
  },
  {
    title: "Posts y hooks listos para publicar",
    description: "Genera publicaciones en español con tono humano, CTA, hashtags y ángulos adaptados a LinkedIn.",
    icon: BrainCircuit,
  },
  {
    title: "Lectura real de empleabilidad",
    description: "Sube tu CV, detecta skill gaps y crea un roadmap accionable para mejorar visibilidad y competitividad.",
    icon: LineChart,
  },
  {
    title: "CV + contenido en un solo flujo",
    description: "Convierte tus habilidades prioritarias en ideas, storytelling y contenido de autoridad.",
    icon: FileUp,
  },
];

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative">
        <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-6">
          <header
            className="surface flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="eyebrow">Career LinkedIn Copilot</p>
              <p className="mt-1 text-sm text-muted">SaaS para profesionales que quieren crecer con intención.</p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link className="btn-primary" to="/auth">
                Ingresar
              </Link>
            </div>
          </header>

          <div className="grid gap-10 px-2 pb-20 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-16">
            <div>
              <div className="badge-pill">
                Lanza tu marca personal más rápido
              </div>
              <h1 className="mt-6 max-w-3xl font-display text-5xl leading-tight md:text-7xl" style={{ color: "var(--text-primary)" }}>
                Tu copiloto para crecer en LinkedIn, cerrar skill gaps y generar oportunidades.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                Career LinkedIn Copilot ayuda a profesionales hispanohablantes a construir presencia, producir contenido útil y traducir su experiencia en empleabilidad visible.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link className="btn-primary gap-2" to="/auth">
                  Crear cuenta
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a className="btn-secondary" href="#beneficios">
                  Ver beneficios
                </a>
              </div>
              <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
                {[
                  ["Posts listos", "de idea a borrador en minutos"],
                  ["Skill gap", "análisis 0-100"],
                  ["Roadmaps", "30, 90 y 180 días"],
                ].map(([title, text]) => (
                  <div key={title} className="soft-card p-4">
                    <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{title}</p>
                    <p className="mt-2 text-sm text-muted">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface relative overflow-hidden p-6 md:p-8">
              <div
                className="absolute -right-10 top-0 h-32 w-32 rounded-full blur-3xl"
                style={{ background: "color-mix(in srgb, var(--accent) 28%, transparent)" }}
              />
              <div className="relative space-y-4">
                <div className="surface-hero p-6 text-white">
                  <p className="text-sm uppercase tracking-[0.25em]" style={{ color: "var(--accent-strong)" }}>Career Growth Dashboard</p>
                  <p className="mt-4 font-display text-6xl">82</p>
                  <p className="mt-3 text-sm text-white/75">Competitiveness Score basado en perfil, CV y posicionamiento.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="soft-card p-5">
                    <p className="eyebrow">Skill prioritaria</p>
                    <p className="mt-3 text-lg font-bold" style={{ color: "var(--text-primary)" }}>Thought leadership system</p>
                    <p className="mt-2 text-sm leading-7 text-muted">Convierte expertise real en una narrativa pública repetible.</p>
                  </div>
                  <div className="soft-card p-5" style={{ background: "var(--success-soft)" }}>
                    <p className="eyebrow">Siguiente post</p>
                    <p className="mt-3 text-lg font-bold" style={{ color: "var(--text-primary)" }}>El error más caro en un lanzamiento B2B</p>
                    <p className="mt-2 text-sm leading-7 text-muted">Storytelling con foco en autoridad y proof of work.</p>
                  </div>
                </div>
                <div className="soft-card p-5">
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Resultado esperado</p>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    Más visibilidad, más claridad de posicionamiento y más oportunidades laborales o comerciales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="beneficios" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <SectionHeading
          eyebrow="Beneficios"
          title="Un MVP enfocado en resultados, no en ruido."
          description="La plataforma agrupa los flujos más valiosos para un profesional individual: perfil, contenido, CV, skills y roadmap."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {features.map(({ title, description, icon: Icon }) => (
            <article key={title} className="surface p-6">
              <div className="inline-flex rounded-2xl p-3" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{title}</h3>
              <p className="mt-3 text-base leading-7 text-muted">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-6">
        <div className="surface overflow-hidden p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="eyebrow">Casos de uso</p>
              <h2 className="mt-4 font-display text-4xl" style={{ color: "var(--text-primary)" }}>Desde búsqueda laboral hasta consultoría independiente.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                Puedes usar la plataforma para fortalecer tu perfil, crear autoridad pública y detectar qué habilidades te conviene desarrollar para moverte mejor en el mercado.
              </p>
            </div>
            <div className="space-y-4">
              {[
                "Profesionales que quieren dejar de publicar contenido genérico.",
                "Personas en transición laboral que necesitan una narrativa más fuerte.",
                "Consultores o freelancers que buscan atraer oportunidades con contenido.",
              ].map((item) => (
                <div key={item} className="soft-card px-5 py-4 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
