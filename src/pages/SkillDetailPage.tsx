import { useParams, useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft, BookOpen, Compass, ExternalLink, GraduationCap } from "lucide-react";

interface Resource {
  title: string;
  url: string;
  description: string;
}

interface SkillInfo {
  name: string;
  description: string;
  resources: Resource[];
  roadmapSteps: { title: string; duration: string; details: string }[];
}

const skillDatabase: Record<string, SkillInfo> = {
  react: {
    name: "React",
    description: "Biblioteca de JavaScript de código abierto para construir interfaces de usuario interactivas y declarativas en aplicaciones web de una sola página (SPA). Es el estándar de facto en el frontend moderno.",
    resources: [
      { title: "React.dev (Documentación Oficial)", url: "https://react.dev", description: "La guía interactiva de inicio oficial y referencia detallada de APIs." },
      { title: "Curso de React de Midudev", url: "https://midu.live", description: "Curso completo y gratuito en español ideal para ir desde cero a nivel avanzado." },
      { title: "React Cheat Sheet", url: "https://reactcheatsheet.com", description: "Referencia rápida de hooks, componentes y sintaxis común." }
    ],
    roadmapSteps: [
      { title: "Conceptos Fundamentales", duration: "Semana 1", details: "Aprende JSX, Componentes, Props, State y Renderizado Condicional." },
      { title: "Hooks Esenciales", duration: "Semana 2", details: "Domina useState, useEffect y useRef para ciclo de vida y referencias." },
      { title: "Gestión de Estado y Rutas", duration: "Semana 3", details: "Implementa React Router para navegación y Zustand o Context para estado global." },
      { title: "Proyectos e Integración", duration: "Semana 4", details: "Construye una SPA consumiendo APIs externas y optimiza renderizados." }
    ]
  },
  aws: {
    name: "AWS (Amazon Web Services)",
    description: "Plataforma de servicios de computación en la nube líder a nivel mundial que ofrece potencia de cómputo, almacenamiento de bases de datos y entrega de contenido para ayudar a las empresas a escalar.",
    resources: [
      { title: "AWS Skill Builder", url: "https://explore.skillbuilder.aws", description: "Cursos y rutas de aprendizaje oficiales gratuitos proporcionados por Amazon." },
      { title: "AWS Cloud Practitioner Course", url: "https://www.freecodecamp.org", description: "Curso intensivo en video para obtener la certificación básica de AWS." },
      { title: "Documentación oficial de AWS", url: "https://docs.aws.amazon.com", description: "Guías detalladas de arquitectura y manuales de referencia de servicios." }
    ],
    roadmapSteps: [
      { title: "Fundamentos Cloud", duration: "Semana 1", details: "Entiende qué es IaaS, PaaS, Regiones, Zonas de Disponibilidad e IAM." },
      { title: "Servicios de Cómputo y Almacenamiento", duration: "Semana 2", details: "Configura instancias EC2, funciones Lambda serverless y buckets S3." },
      { title: "Redes y Bases de Datos", duration: "Semana 3", details: "Crea VPCs virtuales, subredes seguras e implementa bases de datos RDS y DynamoDB." },
      { title: "Certificación y Práctica", duration: "Semana 4+", details: "Realiza simulaciones de examen Cloud Practitioner y despliega un sitio web estático seguro." }
    ]
  },
  testing: {
    name: "Testing Automatizado",
    description: "Conjunto de prácticas y herramientas para ejecutar pruebas automáticas sobre el código, asegurando la calidad del software y previniendo regresiones en el comportamiento de la aplicación.",
    resources: [
      { title: "Testing Library Docs", url: "https://testing-library.com", description: "Pruebas de componentes enfocadas en el comportamiento del usuario final." },
      { title: "Cypress (Pruebas End-to-End)", url: "https://docs.cypress.io", description: "Documentación oficial para configurar pruebas E2E interactivas y veloces." },
      { title: "Jest / Vitest Guide", url: "https://jestjs.io", description: "Manual oficial para unit testing rápido y mocking de librerías." }
    ],
    roadmapSteps: [
      { title: "Pruebas Unitarias Básicas", duration: "Semana 1", details: "Escribe asserts básicos con Jest o Vitest sobre funciones puras." },
      { title: "Pruebas de Componentes", duration: "Semana 2", details: "Simula clics, ingresos de formularios y renderizados con React Testing Library." },
      { title: "Pruebas de Integración y Mocks", duration: "Semana 3", details: "Aprende a simular llamados HTTP de backend con MSW (Mock Service Worker)." },
      { title: "Pruebas End-to-End (E2E)", duration: "Semana 4", details: "Escribe flujos completos de login, checkout o navegación con Cypress o Playwright." }
    ]
  },
  python: {
    name: "Python",
    description: "Lenguaje de programación de alto nivel, interpretado y multiparadigma. Es famoso por su sintaxis clara y legible, ideal para backend, automatizaciones, analítica y machine learning.",
    resources: [
      { title: "Tutorial Oficial de Python", url: "https://docs.python.org/es/3/tutorial/", description: "El punto de partida oficial y completo traducido al español." },
      { title: "Automate the Boring Stuff", url: "https://automatetheboringstuff.com", description: "Libro práctico excelente enfocado en automatización de tareas con Python." },
      { title: "Python en W3Schools", url: "https://www.w3schools.com/python/", description: "Tutorial con consola interactiva para repasar sintaxis rápidamente." }
    ],
    roadmapSteps: [
      { title: "Sintaxis y Estructuras de Datos", duration: "Semana 1", details: "Domina variables, bucles, listas, diccionarios y lectura de archivos básicos." },
      { title: "Programación Orientada a Objetos", duration: "Semana 2", details: "Crea clases, métodos, comprende la herencia y el manejo de excepciones." },
      { title: "Paquetes y Backend", duration: "Semana 3", details: "Aprende sobre entornos virtuales, pip, y desarrolla una API básica con FastAPI o Flask." },
      { title: "Scripting y Automatización", duration: "Semana 4", details: "Escribe scripts para interactuar con el sistema operativo, web scraping básico o APIs externas." }
    ]
  },
  git: {
    name: "Git",
    description: "Sistema de control de versiones distribuido que facilita la colaboración en equipo, el control del historial de cambios y la gestión de ramas de desarrollo en proyectos de software.",
    resources: [
      { title: "Git Book (Oficial)", url: "https://git-scm.com/book/es/v2", description: "El libro de referencia oficial de Git con explicaciones detalladas y gratuitas." },
      { title: "Oh My Git!", url: "https://ohmygit.org", description: "Un juego interactivo para aprender los flujos y comandos de Git visualmente." },
      { title: "Git Flight Rules", url: "https://github.com/k88hudson/git-flight-rules", description: "Guía de soluciones ante errores comunes y rescates en Git." }
    ],
    roadmapSteps: [
      { title: "Conceptos Clave y Commits", duration: "Días 1-3", details: "Comprende el Working Directory, Staging Area, git add, commit y git log." },
      { title: "Ramas e Integración", duration: "Días 4-7", details: "Crea ramas, realiza merges, resuelve conflictos comunes y usa git checkout/switch." },
      { title: "Colaboración Remota", duration: "Semana 2", details: "Sube repositorios a GitHub, realiza Pull Requests y colabora con git fetch/pull." },
      { title: "Comandos Avanzados", duration: "Semana 3", details: "Aprende a usar git rebase, git cherry-pick, stash y git revert de forma segura." }
    ]
  },
  docker: {
    name: "Docker",
    description: "Tecnología de contenedorización que empaqueta una aplicación y sus dependencias en un entorno aislado, asegurando que funcione igual en cualquier máquina local, staging o producción.",
    resources: [
      { title: "Docker Get Started Guide", url: "https://docs.docker.com/get-started/", description: "Guía introductoria interactiva oficial de Docker." },
      { title: "Play with Docker", url: "https://labs.play-with-docker.com", description: "Laboratorio interactivo en el navegador para practicar comandos de Docker gratis." },
      { title: "Docker Cheat Sheet", url: "https://dockerlabs.collabnix.com", description: "Colección rápida de sintaxis de Dockerfile y comandos CLI." }
    ],
    roadmapSteps: [
      { title: "Conceptos y Comandos Básicos", duration: "Semana 1", details: "Comprende la diferencia entre Contenedor e Imagen. Usa docker run, exec, ps." },
      { title: "Escribir Dockerfiles", duration: "Semana 2", details: "Crea tus propias imágenes configurando Dockerfiles optimizados paso a paso." },
      { title: "Docker Compose", duration: "Semana 3", details: "Configura múltiples contenedores interconectados (App + DB) usando docker-compose.yml." },
      { title: "Volúmenes y Redes", duration: "Semana 4", details: "Domina la persistencia de datos (Volumes) y la comunicación aislada entre contenedores (Networks)." }
    ]
  }
};

export default function SkillDetailPage() {
  const { skillName } = useParams<{ skillName: string }>();
  const navigate = useNavigate();
  const { signOut, userEmail } = useAuth();

  const formattedKey = skillName?.toLowerCase().trim() || "";
  const matchedSkill = skillDatabase[formattedKey] || {
    name: skillName || "Habilidad Profesional",
    description: "Esta habilidad ha sido identificada como una brecha clave en tu perfil para mejorar tu posicionamiento, empleabilidad o visibilidad en el mercado actual.",
    resources: [
      { title: "Documentación Oficial del Stack", url: "https://google.com", description: "El mejor punto de partida es buscar la documentación oficial o la especificación del lenguaje." },
      { title: "Cursos Prácticos en YouTube o Coursera", url: "https://youtube.com", description: "Busca tutoriales prácticos enfocados en construir proyectos reales desde cero." },
      { title: "Comunidades y Foros (StackOverflow, GitHub)", url: "https://stackoverflow.com", description: "Interactúa con otros desarrolladores para resolver bloqueos y compartir mejores prácticas." }
    ],
    roadmapSteps: [
      { title: "Bases y Fundamentos", duration: "Semana 1", details: "Aprende los conceptos clave, terminología básica y configuraciones de entorno iniciales." },
      { title: "Práctica Guiada", duration: "Semana 2", details: "Sigue tutoriales construyendo pequeñas utilidades prácticas o replicando ejemplos reales." },
      { title: "Proyectos Propios", duration: "Semana 3", details: "Escribe código de forma independiente para resolver un problema de mediana complejidad." },
      { title: "Especialización e Integración", duration: "Semana 4", details: "Aprende sobre optimización, debugging y despliega tu desarrollo en un entorno real." }
    ]
  };

  return (
    <AppShell email={userEmail} onSignOut={signOut}>
      <div className="space-y-6">
        {/* Back navigation and title */}
        <div className="surface p-6 min-w-0">
          <button
            type="button"
            className="btn-secondary gap-2 mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">Detalles de Habilidad</p>
              <h1 className="mt-2 text-4xl font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
                {matchedSkill.name}
              </h1>
            </div>
            <div className="badge-pill whitespace-nowrap self-start sm:self-center">Upskilling Recomendado</div>
          </div>

          <p className="mt-4 text-base leading-7 text-muted max-w-4xl">
            {matchedSkill.description}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Resources card (3 cols) */}
          <div className="surface p-6 lg:col-span-3 space-y-5">
            <div className="flex items-center gap-3 border-b border-[var(--border)] pb-3">
              <BookOpen className="h-5 w-5" style={{ color: "var(--accent)" }} />
              <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                Recursos para Aprender
              </h3>
            </div>

            <div className="space-y-4">
              {matchedSkill.resources.map((res) => (
                <a
                  key={res.title}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="soft-card block p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_50%,transparent)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-base font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                      <GraduationCap className="h-4 w-4" style={{ color: "var(--accent)" }} />
                      {res.title}
                    </h4>
                    <ExternalLink className="h-4 w-4 text-muted shrink-0" />
                  </div>
                  <p className="mt-2 text-xs leading-5 text-muted">
                    {res.description}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* Mini-roadmap card (2 cols) */}
          <div className="surface p-6 lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3 border-b border-[var(--border)] pb-3">
              <Compass className="h-5 w-5" style={{ color: "var(--accent)" }} />
              <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                Plan de Ruta Rápido
              </h3>
            </div>

            <div className="relative pl-6 border-l border-[color-mix(in_srgb,var(--accent)_30%,transparent)] space-y-6">
              {matchedSkill.roadmapSteps.map((step, idx) => (
                <div key={step.title} className="relative">
                  {/* Timeline dot */}
                  <span
                    className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-surface"
                    style={{ background: "var(--accent)" }}
                  />
                  <div>
                    <span className="badge-pill !text-[10px] !py-0.5 !px-2">
                      {step.duration}
                    </span>
                    <h4 className="mt-2 text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                      {idx + 1}. {step.title}
                    </h4>
                    <p className="mt-1.5 text-xs leading-5 text-muted">
                      {step.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
