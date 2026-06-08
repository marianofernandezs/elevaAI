import { ArrowRight, BrainCircuit, FileUp, LineChart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeading from "../components/ui/SectionHeading";

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
        <div className="absolute inset-0 bg-grain" />
        <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-6">
          <header className="surface flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">Career LinkedIn Copilot</p>
              <p className="mt-1 text-sm text-slate-600">SaaS para profesionales que quieren crecer con intención.</p>
            </div>
            <Link className="btn-primary" to="/auth">
              Ingresar
            </Link>
          </header>

          <div className="grid gap-10 px-2 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="inline-flex rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                Lanza tu marca personal más rápido
              </div>
              <h1 className="mt-6 max-w-3xl font-display text-5xl leading-tight text-slate-950 md:text-7xl">
                Tu copiloto para crecer en LinkedIn, cerrar skill gaps y generar oportunidades.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
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
                  <div key={title} className="rounded-3xl border border-white/70 bg-white/75 p-4">
                    <p className="text-xl font-bold text-slate-950">{title}</p>
                    <p className="mt-2 text-sm text-slate-600">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface relative overflow-hidden p-6 md:p-8">
              <div className="absolute inset-x-12 top-0 h-24 rounded-full bg-amber-200/40 blur-3xl" />
              <div className="relative space-y-4">
                <div className="rounded-3xl bg-slate-950 p-6 text-white">
                  <p className="text-sm uppercase tracking-[0.25em] text-amber-300">Career Growth Dashboard</p>
                  <p className="mt-4 font-display text-6xl">82</p>
                  <p className="mt-3 text-sm text-slate-300">Competitiveness Score basado en perfil, CV y posicionamiento.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl bg-amber-50 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Skill prioritaria</p>
                    <p className="mt-3 text-lg font-bold text-slate-950">Thought leadership system</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">Convierte expertise real en una narrativa pública repetible.</p>
                  </div>
                  <div className="rounded-3xl bg-emerald-50 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Siguiente post</p>
                    <p className="mt-3 text-lg font-bold text-slate-950">El error más caro en un lanzamiento B2B</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">Storytelling con foco en autoridad y proof of work.</p>
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-700">Resultado esperado</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
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
              <div className="inline-flex rounded-2xl bg-amber-50 p-3 text-amber-700">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-2xl font-bold text-slate-950">{title}</h3>
              <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-6">
        <div className="surface overflow-hidden p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">Casos de uso</p>
              <h2 className="mt-4 font-display text-4xl text-slate-950">Desde búsqueda laboral hasta consultoría independiente.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Puedes usar la plataforma para fortalecer tu perfil, crear autoridad pública y detectar qué habilidades te conviene desarrollar para moverte mejor en el mercado.
              </p>
            </div>
            <div className="space-y-4">
              {[
                "Profesionales que quieren dejar de publicar contenido genérico.",
                "Personas en transición laboral que necesitan una narrativa más fuerte.",
                "Consultores o freelancers que buscan atraer oportunidades con contenido.",
              ].map((item) => (
                <div key={item} className="rounded-3xl bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-700">
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
