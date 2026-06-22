import { useState } from "react";
import { 
  ArrowRight, 
  BrainCircuit, 
  LineChart, 
  Sparkles, 
  UserCheck, 
  ChevronRight, 
  Target, 
  PenTool, 
  Calendar,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ui/ThemeToggle";

const benefits = [
  {
    title: "Encuentra tu posicionamiento",
    description: "Define tu propuesta de valor única y el ángulo exacto para ser percibido como un referente en tu sector.",
    icon: Target,
  },
  {
    title: "Publica sin partir desde cero",
    description: "Recibe ganchos de alto impacto (hooks), ideas y borradores completos alineados con tu experiencia profesional.",
    icon: PenTool,
  },
  {
    title: "Detecta oportunidades de mejora",
    description: "Analiza de forma integral brechas en tu perfil público o CV y obtén sugerencias prácticas para optimizarlos.",
    icon: LineChart,
  },
  {
    title: "Conecta perfil, CV y contenido",
    description: "Garantiza una alinemento perfecto entre tu trayectoria real y los mensajes que compartes diariamente en LinkedIn.",
    icon: Layers,
  },
];

const steps = [
  {
    number: "01",
    title: "Completa tu perfil profesional",
    description: "Ingresa tu experiencia, sube tu CV o describe tu rol actual. Definiremos juntos tus objetivos de posicionamiento.",
    icon: UserCheck
  },
  {
    number: "02",
    title: "Recibe tu estrategia a medida",
    description: "ElevaAI procesa tu perfil para generar una propuesta de posicionamiento clara, identificando tus tres pilares clave.",
    icon: BrainCircuit
  },
  {
    number: "03",
    title: "Publica con dirección",
    description: "Accede a ideas de contenido, hooks optimizados y borradores listos para copiar, editar y compartir en LinkedIn.",
    icon: Sparkles
  }
];

const useCases = [
  {
    badge: "Profesionales ocupados",
    title: "Quieren dejar de publicar contenido genérico",
    desc: "Evita los posts corporativos aburridos. ElevaAI te ayuda a extraer aprendizajes auténticos de tus proyectos diarios."
  },
  {
    badge: "Transición de carrera",
    title: "Buscan comunicar su experiencia con impacto",
    desc: "Alinea tu CV y tus posts públicos para que reclutadores y empresas conecten inmediatamente con tu propuesta de valor."
  },
  {
    badge: "Consultores y Freelancers",
    title: "Atraen oportunidades con proof of work",
    desc: "Demuestra autoridad resolviendo problemas reales en público. Convierte tu conocimiento en un imán de clientes cualificados."
  },
  {
    badge: "Perfiles Técnicos / Expertos",
    title: "Dominan su área pero no saben cómo comunicarla",
    desc: "Traduce tecnicismos complejos en narrativas comprensibles y atractivas para directores de área y tomadores de decisión."
  }
];

export default function LandingPage() {
  const [activePreviewTab, setActivePreviewTab] = useState<"posicionamiento" | "pilares" | "posts" | "roadmap">("posicionamiento");

  return (
    <div className="overflow-hidden min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      {/* Header */}
      <header className="relative mx-auto max-w-7xl px-4 pt-6 md:px-6">
        <div className="surface flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between rounded-[2rem] border border-[var(--border)] backdrop-blur-md">
          <div className="min-w-0">
            <span className="font-display text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>ElevaAI</span>
            <p className="text-xs font-semibold tracking-wider uppercase opacity-85" style={{ color: "var(--accent)" }}>Marca Personal en LinkedIn</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link className="btn-secondary" to="/auth">
              Ingresar
            </Link>
            <Link className="btn-primary" to="/auth">
              Crear mi estrategia
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="badge-pill mb-6">
              Posicionamiento & Marca Personal
            </div>
            <h1 className="font-display text-4xl font-normal leading-[1.15] md:text-6xl lg:text-7xl" style={{ color: "var(--text-primary)" }}>
              Construye tu marca personal en LinkedIn sin quedarte en blanco.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-secondary" style={{ color: "var(--text-secondary)" }}>
              ElevaAI analiza tu perfil profesional, detecta tus fortalezas y te ayuda a crear posts, hooks e ideas de contenido alineadas con tus objetivos laborales o comerciales.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link className="btn-primary gap-2 text-base px-6 py-3.5 shadow-lg hover:shadow-xl transition-all duration-300" to="/auth">
                Crear mi estrategia
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a className="btn-secondary text-base px-6 py-3.5" href="#como-funciona">
                Ver cómo funciona
              </a>
            </div>
            
            {/* Quick Metrics */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-[var(--border)] pt-8">
              <div>
                <p className="text-3xl font-display font-semibold" style={{ color: "var(--accent)" }}>100%</p>
                <p className="mt-1 text-xs font-semibold tracking-tight uppercase" style={{ color: "var(--text-secondary)" }}>Foco Profesional</p>
              </div>
              <div>
                <p className="text-3xl font-display font-semibold" style={{ color: "var(--accent)" }}>3</p>
                <p className="mt-1 text-xs font-semibold tracking-tight uppercase" style={{ color: "var(--text-secondary)" }}>Pilares Claros</p>
              </div>
              <div>
                <p className="text-3xl font-display font-semibold" style={{ color: "var(--accent)" }}>0</p>
                <p className="mt-1 text-xs font-semibold tracking-tight uppercase" style={{ color: "var(--text-secondary)" }}>Hojas en Blanco</p>
              </div>
            </div>
          </div>

          {/* Dashboard Preview / Mockup */}
          <div className="surface relative overflow-hidden p-6 md:p-8 rounded-[2rem] border border-[var(--border)] shadow-[var(--shadow)]">
            <div
              className="absolute -right-10 top-0 h-36 w-36 rounded-full blur-3xl"
              style={{ background: "color-mix(in srgb, var(--accent) 30%, transparent)" }}
            />
            <div className="relative space-y-5">
              {/* Header de la estrategia */}
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--accent)" }}>ElevaAI Dashboard</p>
                  <h3 className="mt-1 text-lg font-bold" style={{ color: "var(--text-primary)" }}>Tu estrategia de marca personal</h3>
                </div>
                <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Activa
                </div>
              </div>

              {/* Posicionamiento */}
              <div className="soft-card p-5">
                <p className="eyebrow">Posicionamiento clave</p>
                <p className="mt-2 text-base font-bold leading-snug" style={{ color: "var(--text-primary)" }}>
                  Especialista en automatización logística para equipos B2B
                </p>
                <p className="mt-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                  Ángulo: Optimización de recursos mediante tecnología, liderando la conversación de eficiencia operativa.
                </p>
              </div>

              {/* Pilares */}
              <div className="soft-card p-5">
                <p className="eyebrow">Pilares de contenido</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Automatización aplicada", "Casos reales", "Aprendizajes profesionales"].map((pilar) => (
                    <span 
                      key={pilar} 
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ backgroundColor: "var(--panel-muted)", color: "var(--text-primary)" }}
                    >
                      {pilar}
                    </span>
                  ))}
                </div>
              </div>

              {/* Siguiente Post */}
              <div className="soft-card p-5" style={{ background: "var(--success-soft)", borderColor: "rgba(45, 98, 81, 0.2)" }}>
                <div className="flex items-center justify-between">
                  <p className="eyebrow">Próximo post sugerido</p>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Alta conversión</span>
                </div>
                <p className="mt-2 text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  Lo que aprendí automatizando procesos en operaciones logísticas
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                  Pilar: Aprendizajes profesionales. Tono: Storytelling con foco en de autoridad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "Cómo funciona" Section */}
      <section id="como-funciona" className="relative border-t border-[var(--border)] py-20 md:py-28" style={{ backgroundColor: "var(--bg-accent)" }}>
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="eyebrow">Paso a paso</span>
            <h2 className="mt-3 font-display text-4xl font-normal md:text-5xl" style={{ color: "var(--text-primary)" }}>
              Cómo funciona tu copiloto de marca personal
            </h2>
            <p className="mt-4 text-base leading-relaxed text-secondary" style={{ color: "var(--text-secondary)" }}>
              Un proceso simple diseñado para transformar tus conocimientos en publicaciones de valor que atraigan oportunidades de negocio o desarrollo profesional.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="surface relative p-8 rounded-[2rem] border border-[var(--border)] transition-transform duration-300 hover:-translate-y-1">
                  <div className="absolute top-6 right-8 font-display text-5xl font-extrabold opacity-10 select-none" style={{ color: "var(--accent)" }}>
                    {step.number}
                  </div>
                  <div className="inline-flex rounded-2xl p-4 mb-6" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold font-display" style={{ color: "var(--text-primary)" }}>
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-secondary" style={{ color: "var(--text-secondary)" }}>
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link className="btn-primary gap-2 px-8 py-3.5 shadow-md" to="/auth">
              Crear mi estrategia
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Cards Section */}
      <section id="beneficios" className="mx-auto max-w-7xl px-4 py-20 md:py-28 md:px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span className="eyebrow">Beneficios clave</span>
          <h2 className="mt-3 font-display text-4xl font-normal md:text-5xl" style={{ color: "var(--text-primary)" }}>
            Construye autoridad real en LinkedIn
          </h2>
          <p className="mt-4 text-base leading-relaxed text-secondary" style={{ color: "var(--text-secondary)" }}>
            No necesitas ser escritor ni influencer. La plataforma automatiza la parte estratégica para que tú solo te enfoques en refinar y validar tus ideas.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {benefits.map(({ title, description, icon: Icon }) => (
            <article key={title} className="surface p-8 rounded-[2rem] border border-[var(--border)] flex gap-6 items-start">
              <div className="inline-flex rounded-2xl p-3.5 shrink-0" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-display" style={{ color: "var(--text-primary)" }}>{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-secondary" style={{ color: "var(--text-secondary)" }}>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Product Preview Section */}
      <section id="preview" className="border-t border-b border-[var(--border)] py-20 md:py-28" style={{ backgroundColor: "var(--bg-accent)" }}>
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="eyebrow">Visualiza tus resultados</span>
              <h2 className="mt-3 font-display text-4xl font-normal md:text-5xl leading-tight" style={{ color: "var(--text-primary)" }}>
                Explora el output de tu marca personal
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-secondary" style={{ color: "var(--text-secondary)" }}>
                ElevaAI genera entregables claros para que estructures tu presencia digital con coherencia y fluidez desde el primer día.
              </p>

              {/* Selector de pestañas */}
              <div className="mt-8 flex flex-col gap-2.5">
                {[
                  { id: "posicionamiento", label: "Posicionamiento profesional", icon: Target },
                  { id: "pilares", label: "Pilares de contenido", icon: Layers },
                  { id: "posts", label: "Ideas de posts & ganchos", icon: PenTool },
                  { id: "roadmap", label: "Roadmap de contenido", icon: Calendar },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activePreviewTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActivePreviewTab(tab.id as any)}
                      className="flex items-center gap-3 w-full px-5 py-3.5 rounded-xl border transition-all text-left text-sm font-semibold hover:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      style={{ 
                        backgroundColor: isActive ? "var(--panel-strong)" : "transparent",
                        borderColor: isActive ? "var(--accent)" : "transparent",
                        color: isActive ? "var(--accent-strong)" : "var(--text-secondary)"
                      }}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{tab.label}</span>
                      {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulación del entregable / Visual representation */}
            <div className="surface p-6 md:p-8 rounded-[2rem] border border-[var(--border)] min-h-[350px] flex flex-col justify-between shadow-md">
              {activePreviewTab === "posicionamiento" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>Propuesta de Posicionamiento</span>
                    <span className="text-xs font-semibold text-secondary" style={{ color: "var(--text-secondary)" }}>Perfil Profesional</span>
                  </div>
                  <h4 className="text-2xl font-display font-medium" style={{ color: "var(--text-primary)" }}>
                    "Líder de Producto | Escalando plataformas SaaS con foco en growth loops"
                  </h4>
                  <div className="space-y-3 pt-2">
                    <div>
                      <p className="text-xs font-bold uppercase" style={{ color: "var(--accent-strong)" }}>Audiencia objetivo</p>
                      <p className="text-sm mt-1 text-secondary" style={{ color: "var(--text-secondary)" }}>
                        Fundadores de startups tecnológicas, directores de marketing de crecimiento y gerentes de producto B2B.
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase" style={{ color: "var(--accent-strong)" }}>Ángulo de autoridad</p>
                      <p className="text-sm mt-1 text-secondary" style={{ color: "var(--text-secondary)" }}>
                        Desmitificar la teoría del product-led growth compartiendo métricas reales, errores costosos y plantillas accionables.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activePreviewTab === "pilares" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>Pilares Estratégicos</span>
                    <span className="text-xs font-semibold text-secondary" style={{ color: "var(--text-secondary)" }}>3 Dimensiones</span>
                  </div>
                  
                  <div className="grid gap-4">
                    {[
                      { title: "Product-Led Growth", desc: "Casos de estudio, diagramas de loops y frameworks de adquisición." },
                      { title: "UX & Experiencia de Usuario", desc: "Análisis de onboarding, optimización de flujos y fricción de producto." },
                      { title: "Storytelling de SaaS", desc: "Aprendizajes reales escalando equipos y gestionando stakeholders." },
                    ].map((pilar, index) => (
                      <div key={index} className="soft-card p-4 flex gap-4 items-start">
                        <div className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-bold" style={{ color: "var(--accent)" }}>
                          0{index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{pilar.title}</p>
                          <p className="text-xs mt-1 text-secondary" style={{ color: "var(--text-secondary)" }}>{pilar.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activePreviewTab === "posts" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>Idea de Post & Gancho</span>
                    <span className="text-xs font-semibold text-secondary" style={{ color: "var(--text-secondary)" }}>Borrador Rápido</span>
                  </div>
                  
                  <div className="soft-card p-5 space-y-3 bg-[var(--panel-strong)]">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider uppercase bg-[var(--accent-soft)] text-[var(--accent)] px-2 py-0.5 rounded">
                        Pilar: Product-Led Growth
                      </span>
                    </div>
                    <p className="text-sm font-semibold italic" style={{ color: "var(--text-primary)" }}>
                      "Por qué los growth loops matan a los funnels tradicionales de marketing..."
                    </p>
                    <div className="border-t border-[var(--border)] pt-2 mt-2">
                      <p className="text-xs font-semibold" style={{ color: "var(--accent-strong)" }}>Estructura del post:</p>
                      <ul className="text-xs mt-1 space-y-1 list-disc list-inside text-secondary" style={{ color: "var(--text-secondary)" }}>
                        <li><strong>Gancho (Hook):</strong> La mayoría de los presupuestos se queman en embudos tradicionales.</li>
                        <li><strong>Desarrollo:</strong> Explicación de la retención y la adquisición basada en el producto.</li>
                        <li><strong>Proof:</strong> Gráfico o paso a paso de cómo lo estructuramos en X proyecto.</li>
                        <li><strong>Llamado a la acción:</strong> Preguntar al lector si usa loops o funnels.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activePreviewTab === "roadmap" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>Roadmap de Contenido</span>
                    <span className="text-xs font-semibold text-secondary" style={{ color: "var(--text-secondary)" }}>Hitos de Crecimiento</span>
                  </div>

                  <div className="relative border-l border-[var(--border)] ml-3 pl-6 space-y-4">
                    {[
                      { time: "Día 1 - 7: Optimización del Perfil", desc: "Editar el titular (headline), sección Acerca de y experiencia destacada." },
                      { time: "Día 8 - 14: Los Primeros 3 Posts", desc: "Publicar sobre tu expertise técnica resolviendo un problema concreto." },
                      { time: "Día 15+: Escalado de Interacción", desc: "Interactuar en posts de líderes del sector y crear consistencia semanal." },
                    ].map((hito, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-[var(--accent)]" style={{ backgroundColor: "var(--bg-accent)" }} />
                        <p className="text-xs font-bold" style={{ color: "var(--accent-strong)" }}>{hito.time}</p>
                        <p className="text-xs mt-0.5 text-secondary" style={{ color: "var(--text-secondary)" }}>{hito.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                <p className="text-xs text-secondary" style={{ color: "var(--text-secondary)" }}>Prueba esta funcionalidad en segundos</p>
                <Link to="/auth" className="flex items-center gap-1 text-xs font-bold tracking-tight hover:underline" style={{ color: "var(--accent)" }}>
                  <span>Generar mi primer post</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:py-28 md:px-6">
        <div className="surface overflow-hidden p-8 md:p-12 rounded-[2rem] border border-[var(--border)] shadow-[var(--shadow)]">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="eyebrow">Para quién es ElevaAI</span>
              <h2 className="mt-3 font-display text-4xl font-normal leading-snug" style={{ color: "var(--text-primary)" }}>
                Diseñado para profesionales que quieren crecer en LinkedIn
              </h2>
              <p className="mt-4 text-base leading-relaxed text-secondary" style={{ color: "var(--text-secondary)" }}>
                No importa tu área o nivel de experiencia. Si tienes conocimiento que compartir, ElevaAI te ayuda a organizarlo de forma estratégica para destacar.
              </p>
              
              <div className="mt-8">
                <Link className="btn-primary inline-flex gap-2" to="/auth">
                  Crear mi estrategia
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="grid gap-4">
              {useCases.map((useCase, idx) => (
                <div key={idx} className="soft-card p-5 transition-all duration-300 hover:bg-[var(--panel-strong)]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                      {useCase.badge}
                    </span>
                  </div>
                  <h4 className="mt-1 text-base font-bold" style={{ color: "var(--text-primary)" }}>
                    {useCase.title}
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-secondary" style={{ color: "var(--text-secondary)" }}>
                    {useCase.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative mx-auto max-w-7xl px-4 pb-20 md:pb-28">
        <div className="surface text-center p-8 md:p-16 rounded-[2rem] border border-[var(--border)] overflow-hidden relative">
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full blur-3xl opacity-20"
            style={{ background: "var(--accent)" }}
          />
          <div className="relative max-w-2xl mx-auto space-y-6">
            <span className="eyebrow">Marca la diferencia</span>
            <h2 className="font-display text-4xl md:text-5xl leading-tight" style={{ color: "var(--text-primary)" }}>
              ¿Listo para potenciar tu presencia profesional?
            </h2>
            <p className="text-base text-secondary" style={{ color: "var(--text-secondary)" }}>
              No dejes que el algoritmo decida por ti. Define tu estrategia y comienza a posicionarte hoy mismo como un líder de opinión en tu sector.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link className="btn-primary px-8 py-4 text-base shadow-lg" to="/auth">
                Crear mi estrategia
              </Link>
              <Link className="btn-secondary px-8 py-4 text-base" to="/auth">
                Generar mi primer post
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 mt-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-secondary" style={{ color: "var(--text-secondary)" }}>
          <p>© 2026 ElevaAI. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Términos de servicio</a>
            <a href="#" className="hover:underline">Privacidad</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
