import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  ChevronRight,
  FilePenLine,
  FileText,
  Lightbulb,
  Plus,
  Search,
  Sparkles,
  Upload,
  UserCircle2,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import CareerPanel from "../components/career/CareerPanel";
import IdeasPanel from "../components/dashboard/IdeasPanel";
import PostGenerator from "../components/posts/PostGenerator";
import PostLibrary from "../components/posts/PostLibrary";
import ProfileForm from "../components/profile/ProfileForm";
import ResumeUploader from "../components/resume/ResumeUploader";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useAuth } from "../contexts/AuthContext";
import { useWorkspaceData } from "../hooks/useWorkspaceData";
import {
  analyzeSkillGap,
  generateHooks,
  generateIdeas,
  generateLinkedInPost,
  generateRoadmap,
} from "../services/aiService";

type WorkspaceModule =
  | "overview"
  | "profile"
  | "posts"
  | "ideas"
  | "resume"
  | "skills"
  | "roadmap"
  | "library";

interface WorkspacePageProps {
  initialModule?: WorkspaceModule;
}

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  text: string;
}

const moduleMeta: Record<
  WorkspaceModule,
  { title: string; route: string; description: string; accent: string }
> = {
  overview: {
    title: "Lienzo de trabajo",
    route: "/workspace",
    description: "Aquí aparecen los artefactos que va generando tu agente.",
    accent: "Canvas vivo",
  },
  profile: {
    title: "Perfil profesional",
    route: "/profile",
    description: "El contexto base que usa tu agente para escribir, analizar y recomendar.",
    accent: "Contexto",
  },
  posts: {
    title: "Post de LinkedIn",
    route: "/workspace/posts",
    description: "Genera, itera y previsualiza publicaciones listas para mejorar.",
    accent: "Post generado",
  },
  ideas: {
    title: "Ideas y hooks",
    route: "/workspace/ideas",
    description: "Bloques de autoridad, storytelling y ganchos para abrir conversación.",
    accent: "Contenido",
  },
  resume: {
    title: "Análisis de CV",
    route: "/resume-upload",
    description: "Sube tu CV y conviértelo en contexto accionable para el agente.",
    accent: "CV",
  },
  skills: {
    title: "Skill Gap Analysis",
    route: "/skill-gap",
    description: "Cruza perfil, CV y señales del mercado para detectar brechas reales.",
    accent: "Skills",
  },
  roadmap: {
    title: "Roadmap de upskilling",
    route: "/roadmap",
    description: "Planifica acciones a 30 días, 90 días y 6 meses con foco en empleabilidad.",
    accent: "Roadmap",
  },
  library: {
    title: "Biblioteca",
    route: "/library",
    description: "Tus posts y artefactos guardados viven aquí como base de trabajo.",
    accent: "Biblioteca",
  },
};

const quickFilters: Array<{ label: string; module: WorkspaceModule; icon: LucideIcon }> = [
  { label: "Post", module: "posts", icon: FilePenLine },
  { label: "Hooks", module: "ideas", icon: Sparkles },
  { label: "Ideas", module: "ideas", icon: Lightbulb },
  { label: "CV", module: "resume", icon: Upload },
  { label: "Skills", module: "skills", icon: BarChart3 },
];

const routeTabs: Array<{ label: string; module: WorkspaceModule; icon: LucideIcon }> = [
  { label: "Workspace", module: "overview", icon: Bot },
  { label: "Perfil", module: "profile", icon: UserCircle2 },
  { label: "CV", module: "resume", icon: Upload },
  { label: "Skill Gap", module: "skills", icon: BarChart3 },
  { label: "Roadmap", module: "roadmap", icon: Sparkles },
  { label: "Biblioteca", module: "library", icon: BookOpen },
];

function makeAgentReply(prompt: string, activeModule: WorkspaceModule) {
  const lowered = prompt.toLowerCase();

  if (lowered.includes("post")) {
    return {
      module: "posts" as WorkspaceModule,
      reply: "Voy a generar un post y mostrarlo como artefacto principal dentro del canvas.",
    };
  }
  if (lowered.includes("hook")) {
    return {
      module: "ideas" as WorkspaceModule,
      reply: "Abrí el bloque de ideas y hooks para trabajar aperturas más fuertes dentro del lienzo.",
    };
  }
  if (lowered.includes("cv")) {
    return {
      module: "resume" as WorkspaceModule,
      reply: "Te llevo al artefacto de CV para subirlo, resumirlo y volver a analizarlo cuando quieras.",
    };
  }
  if (lowered.includes("skill") || lowered.includes("brecha")) {
    return {
      module: "skills" as WorkspaceModule,
      reply: "Abrí el artefacto de skill gap para cruzar perfil, CV y señales del mercado.",
    };
  }
  if (lowered.includes("roadmap")) {
    return {
      module: "roadmap" as WorkspaceModule,
      reply: "Voy a enfocar el lienzo en el roadmap para revisar próximas acciones y contenido asociado.",
    };
  }
  if (lowered.includes("perfil")) {
    return {
      module: "profile" as WorkspaceModule,
      reply: "Abrí el contexto profesional para afinar cómo piensa y escribe tu agente.",
    };
  }

  return {
    module: activeModule,
    reply: "Puedo convertir tus instrucciones en posts, ideas, hooks, análisis de CV, skill gap o roadmap. Dime qué artefacto quieres ver en el canvas.",
  };
}

function buildAvatarLabel(email: string) {
  const base = email.split("@")[0] ?? "EA";
  return base
    .split(/[.\-_]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "EA";
}

function ArtifactShell({
  eyebrow,
  title,
  description,
  children,
  gradient,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  gradient?: string;
}) {
  return (
    <article
      className="workspace-artifact"
      style={gradient ? { borderTopColor: gradient } : undefined}
    >
      <div className="space-y-2">
        <p className="eyebrow">{eyebrow}</p>
        <h3 className="text-3xl font-bold leading-tight" style={{ color: "var(--canvas-text)" }}>
          {title}
        </h3>
        <p className="text-sm leading-7" style={{ color: "var(--canvas-muted)" }}>
          {description}
        </p>
      </div>
      <div className="mt-6">{children}</div>
    </article>
  );
}

function LinkedInPreviewCard({
  title,
  body,
  hook,
}: {
  title: string;
  body: string;
  hook: string;
}) {
  return (
    <div className="workspace-post-preview mx-auto max-w-md">
      <div className="workspace-post-top">
        <div className="workspace-avatar-dot" />
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--canvas-text)" }}>
            elevaIA Preview
          </p>
          <p className="text-xs" style={{ color: "var(--canvas-muted)" }}>
            Vista previa LinkedIn
          </p>
        </div>
      </div>
      <div className="workspace-post-body">
        <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--canvas-accent)" }}>
          {title}
        </p>
        <h4 className="mt-3 text-3xl font-bold leading-tight" style={{ color: "white" }}>
          {hook}
        </h4>
        <p className="mt-4 text-sm leading-7 text-white/70">
          {body.slice(0, 180)}...
        </p>
      </div>
      <div className="workspace-post-actions">
        {["Like", "Comment", "Repost", "Send"].map((action) => (
          <span key={action}>{action}</span>
        ))}
      </div>
    </div>
  );
}

export default function WorkspacePage({ initialModule = "overview" }: WorkspacePageProps) {
  const { signOut, userEmail } = useAuth();
  const {
    state,
    isLoading,
    banner,
    saveProfile,
    createPost,
    setPostStatus,
    deletePost,
    refreshIdeas,
    uploadResumeFile,
    saveAssessment,
  } = useWorkspaceData();
  const [activeModule, setActiveModule] = useState<WorkspaceModule>(initialModule);
  const [searchTerm, setSearchTerm] = useState("");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "agent-welcome",
      role: "agent",
      text: "Puedo ayudarte a crear posts, hooks, ideas, análisis de CV, skill gap y roadmap. Escribe una instrucción y lo convierto en artefactos dentro del lienzo.",
    },
  ]);
  const [isAgentWorking, setIsAgentWorking] = useState(false);

  useEffect(() => {
    setActiveModule(initialModule);
  }, [initialModule]);

  const conversationItems = useMemo(
    () =>
      [
        ...state.posts.map((post) => ({
          id: `post-${post.id}`,
          title: post.title,
          description: post.goal,
          module: "posts" as WorkspaceModule,
        })),
        ...state.ideas.map((idea) => ({
          id: `idea-${idea.id}`,
          title: idea.title,
          description: idea.pillar,
          module: "ideas" as WorkspaceModule,
        })),
        {
          id: "skills-last",
          title: "Último skill gap",
          description: `Score ${state.assessment.competitivenessScore}`,
          module: "skills" as WorkspaceModule,
        },
      ].filter((item) => {
        const combined = `${item.title} ${item.description}`.toLowerCase();
        return combined.includes(searchTerm.toLowerCase());
      }),
    [searchTerm, state.assessment.competitivenessScore, state.ideas, state.posts],
  );

  async function handleAgentSubmit(nextPrompt?: string) {
    const finalPrompt = (nextPrompt ?? prompt).trim();
    if (!finalPrompt) {
      return;
    }

    setIsAgentWorking(true);
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", text: finalPrompt },
    ]);

    try {
      const { module, reply } = makeAgentReply(finalPrompt, activeModule);
      setActiveModule(module);

      if (module === "ideas") {
        const nextIdeas = await generateIdeas(state.profile);
        await refreshIdeas(nextIdeas);
      }

      if (module === "posts" && finalPrompt.toLowerCase().includes("post")) {
        const generatedPost = await generateLinkedInPost({
          profile: state.profile,
          baseIdea: finalPrompt,
          goal: "Aumentar autoridad",
          type: "Storytelling",
          length: "Media",
        });
        await createPost(generatedPost);
      }

      if (module === "skills" && state.resume) {
        const nextAssessment = await analyzeSkillGap({
          profile: state.profile,
          resumeText: state.resume.extractedText,
        });
        const nextRoadmap = await generateRoadmap(nextAssessment);
        await saveAssessment(nextAssessment, nextRoadmap);
      }

      if (module === "ideas" && finalPrompt.toLowerCase().includes("hook")) {
        const hooks = await generateHooks({ profile: state.profile, topic: finalPrompt });
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "agent",
            text: `${reply}\n\nHooks sugeridos:\n- ${hooks.slice(0, 3).join("\n- ")}`,
          },
        ]);
      } else {
        setMessages((current) => [
          ...current,
          { id: crypto.randomUUID(), role: "agent", text: reply },
        ]);
      }
    } finally {
      setPrompt("");
      setIsAgentWorking(false);
    }
  }

  function renderModuleArtifact() {
    switch (activeModule) {
      case "profile":
        return (
          <ArtifactShell
            eyebrow="Perfil profesional"
            title="Contexto del agente"
            description="Este bloque mantiene la información base que guía todos tus prompts, análisis y recomendaciones."
            gradient="var(--canvas-accent)"
          >
            <ProfileForm profile={state.profile} onChange={saveProfile} />
          </ArtifactShell>
        );
      case "posts":
        return (
          <ArtifactShell
            eyebrow="Post generado"
            title={state.posts[0]?.title ?? "Generador de posts"}
            description="Vista de trabajo para crear publicaciones, previsualizarlas y guardarlas en la biblioteca."
            gradient="var(--canvas-accent)"
          >
            <div className="space-y-8">
              {state.posts[0] && (
                <LinkedInPreviewCard
                  title={state.posts[0].title}
                  hook={state.posts[0].hook}
                  body={state.posts[0].content}
                />
              )}
              <PostGenerator profile={state.profile} onPostCreated={createPost} />
            </div>
          </ArtifactShell>
        );
      case "ideas":
        return (
          <ArtifactShell
            eyebrow="Ideas y hooks"
            title="Bloques de contenido"
            description="El agente transforma tu posicionamiento en ideas, ángulos y hooks reutilizables para LinkedIn."
            gradient="var(--canvas-accent)"
          >
            <div className="space-y-8">
              <div className="grid gap-4 md:grid-cols-2">
                {state.ideas.slice(0, 4).map((idea) => (
                  <div key={idea.id} className="workspace-mini-card">
                    <p className="eyebrow">{idea.pillar}</p>
                    <h4 className="mt-2 text-xl font-bold" style={{ color: "var(--canvas-text)" }}>
                      {idea.title}
                    </h4>
                    <p className="mt-3 text-sm leading-7" style={{ color: "var(--canvas-muted)" }}>
                      {idea.description}
                    </p>
                  </div>
                ))}
              </div>
              <IdeasPanel profile={state.profile} ideas={state.ideas} onRefresh={refreshIdeas} />
            </div>
          </ArtifactShell>
        );
      case "resume":
        return (
          <ArtifactShell
            eyebrow="CV"
            title="Análisis de CV"
            description="Sube o actualiza tu CV para convertirlo en contexto útil para skill gap, roadmap y contenido."
            gradient="var(--canvas-accent)"
          >
            <ResumeUploader resume={state.resume} onUpload={uploadResumeFile} />
          </ArtifactShell>
        );
      case "skills":
        return (
          <ArtifactShell
            eyebrow="Skill Gap"
            title="Brechas y fortalezas"
            description="Tu agente cruza perfil, CV y señales del mercado para identificar prioridades reales."
            gradient="var(--canvas-accent)"
          >
            <CareerPanel
              profile={state.profile}
              resume={state.resume}
              assessment={state.assessment}
              roadmap={state.roadmap}
              onUpdate={saveAssessment}
            />
          </ArtifactShell>
        );
      case "roadmap":
        return (
          <ArtifactShell
            eyebrow="Roadmap"
            title="Plan de crecimiento"
            description="Acciones inmediatas, consolidación y diferenciación profesional conectadas con visibilidad en LinkedIn."
            gradient="var(--canvas-accent)"
          >
            <div className="space-y-4">
              {state.roadmap.map((item) => (
                <div key={`${item.horizon}-${item.skill}`} className="workspace-mini-card">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow">{item.horizon}</p>
                      <h4 className="mt-2 text-xl font-bold" style={{ color: "var(--canvas-text)" }}>
                        {item.skill}
                      </h4>
                    </div>
                    <span className="badge-pill">{item.priority}</span>
                  </div>
                  <p className="mt-3 text-sm leading-7" style={{ color: "var(--canvas-muted)" }}>
                    {item.reason}
                  </p>
                  <p className="mt-3 text-sm font-semibold" style={{ color: "var(--canvas-text)" }}>
                    Impacto esperado: {item.expectedImpact}
                  </p>
                </div>
              ))}
            </div>
          </ArtifactShell>
        );
      case "library":
        return (
          <ArtifactShell
            eyebrow="Biblioteca"
            title="Posts y artefactos guardados"
            description="Tu base de trabajo con drafts, publicaciones y materiales listos para iterar."
            gradient="var(--canvas-accent)"
          >
            <PostLibrary posts={state.posts} onUpdateStatus={setPostStatus} onDelete={deletePost} />
          </ArtifactShell>
        );
      case "overview":
      default:
        return (
          <>
            <ArtifactShell
              eyebrow="Post analizado"
              title={state.posts[0]?.title ?? "Post de LinkedIn"}
              description="Vista previa del contenido y métricas estimadas del post seleccionado."
              gradient="var(--canvas-accent)"
            >
              <div className="space-y-8">
                {state.posts[0] && (
                  <LinkedInPreviewCard
                    title={state.posts[0].title}
                    hook={state.posts[0].hook}
                    body={state.posts[0].content}
                  />
                )}
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["Visualizaciones", "12.8K"],
                    ["Likes", "1.2K"],
                    ["Comentarios", "348"],
                    ["Compartidos", "96"],
                  ].map(([label, value]) => (
                    <div key={label} className="workspace-stat-card">
                      <p className="text-sm" style={{ color: "var(--canvas-muted)" }}>{label}</p>
                      <p className="mt-2 text-4xl font-bold" style={{ color: "var(--canvas-text)" }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ArtifactShell>

            <ArtifactShell
              eyebrow="Skill Gap"
              title="Resumen del análisis"
              description="Una vista compacta de tus skills actuales, brechas prioritarias y oportunidades emergentes."
            >
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="workspace-mini-card">
                  <p className="eyebrow">Skills actuales</p>
                  <ul className="mt-4 space-y-2 text-sm leading-7" style={{ color: "var(--canvas-muted)" }}>
                    {state.assessment.currentSkills.slice(0, 3).map((skill) => (
                      <li key={skill}>• {skill}</li>
                    ))}
                  </ul>
                </div>
                <div className="workspace-mini-card">
                  <p className="eyebrow">Brechas</p>
                  <ul className="mt-4 space-y-2 text-sm leading-7" style={{ color: "var(--canvas-muted)" }}>
                    {state.assessment.missingSkills.slice(0, 3).map((skill) => (
                      <li key={skill}>• {skill}</li>
                    ))}
                  </ul>
                </div>
                <div className="workspace-mini-card">
                  <p className="eyebrow">Roadmap</p>
                  <ul className="mt-4 space-y-2 text-sm leading-7" style={{ color: "var(--canvas-muted)" }}>
                    {state.roadmap.slice(0, 3).map((item) => (
                      <li key={`${item.horizon}-${item.skill}`}>• {item.horizon}: {item.skill}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </ArtifactShell>

            <ArtifactShell
              eyebrow="Ideas de contenido"
              title="Artefactos listos para iterar"
              description="El canvas vive de bloques: ideas, posts, análisis y roadmap pueden coexistir en el mismo espacio."
            >
              <div className="grid gap-4 md:grid-cols-2">
                {state.ideas.slice(0, 4).map((idea) => (
                  <button
                    key={idea.id}
                    type="button"
                    className="workspace-mini-card text-left transition hover:-translate-y-0.5"
                    onClick={() => setActiveModule("ideas")}
                  >
                    <p className="eyebrow">{idea.angle}</p>
                    <h4 className="mt-2 text-xl font-bold" style={{ color: "var(--canvas-text)" }}>
                      {idea.title}
                    </h4>
                    <p className="mt-3 text-sm leading-7" style={{ color: "var(--canvas-muted)" }}>
                      {idea.description}
                    </p>
                  </button>
                ))}
              </div>
            </ArtifactShell>
          </>
        );
    }
  }

  return (
    <div className="workspace-shell min-h-screen px-4 py-4 lg:px-5">
      <div className="mx-auto grid min-h-screen max-w-[1720px] gap-0 overflow-hidden rounded-[2rem] border" style={{ borderColor: "var(--border)", background: "var(--workspace-frame)" }}>
        <div className="grid min-h-screen lg:grid-cols-[294px_minmax(0,1fr)]">
          <aside className="workspace-sidebar min-w-0 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-[2rem] font-extrabold leading-none text-white">elevaIA</h1>
                <p className="mt-2 text-sm text-white/60">Agente de IA especializado en LinkedIn</p>
              </div>
              <button
                type="button"
                className="workspace-new-btn"
                onClick={() => {
                  setActiveModule("overview");
                  setMessages((current) => [
                    ...current,
                    {
                      id: crypto.randomUUID(),
                      role: "agent",
                      text: "Nuevo lienzo listo. Dime qué quieres crear y lo convierto en artefactos dentro del canvas.",
                    },
                  ]);
                }}
              >
                <Plus className="h-4 w-4" />
                Nuevo
              </button>
            </div>

            <label className="mt-5 block">
              <div className="workspace-search">
                <Search className="h-4 w-4 text-white/40" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar conversación..."
                />
              </div>
            </label>

            <div className="mt-4 flex flex-wrap gap-2">
              {quickFilters.map(({ label, module, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  className="workspace-filter"
                  onClick={() => setActiveModule(module)}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">Conversación activa</p>
              <div className="mt-3 space-y-3">
                {messages.slice(-4).map((message) => (
                  <div
                    key={message.id}
                    className={`workspace-message-card ${message.role === "user" ? "workspace-message-card--user" : "workspace-message-card--agent"}`}
                  >
                    <p className="text-sm font-semibold text-white">{message.role === "user" ? "Usuario" : "elevaIA"}</p>
                    <p className="mt-2 text-sm leading-6 text-white/70">{message.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex-1 space-y-2 overflow-y-auto pr-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">Artefactos recientes</p>
              {conversationItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="workspace-history-item"
                  onClick={() => setActiveModule(item.module)}
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-white/55">{item.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/35" />
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              <textarea
                className="workspace-prompt"
                placeholder="Escribe una instrucción..."
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
              />
              <button
                type="button"
                className="workspace-send-btn"
                onClick={() => void handleAgentSubmit()}
                disabled={isAgentWorking}
              >
                {isAgentWorking ? "Pensando..." : <ArrowRight className="h-5 w-5" />}
              </button>
            </div>
          </aside>

          <section className="workspace-canvas-wrap min-w-0">
            <header className="workspace-canvas-header">
              <div>
                <h2 className="text-[2rem] font-bold" style={{ color: "var(--canvas-text)" }}>
                  {moduleMeta[activeModule].title}
                </h2>
                <p className="mt-2 text-sm" style={{ color: "var(--canvas-muted)" }}>
                  {moduleMeta[activeModule].description}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <details className="relative">
                  <summary className="workspace-avatar-button list-none">
                    <span>{buildAvatarLabel(userEmail)}</span>
                  </summary>
                  <div className="workspace-avatar-menu">
                    {routeTabs.map(({ label, module, icon: Icon }) => (
                      <NavLink
                        key={label}
                        to={moduleMeta[module].route}
                        className="workspace-avatar-menu__item"
                        onClick={() => setActiveModule(module)}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </NavLink>
                    ))}
                    <button type="button" className="workspace-avatar-menu__item" onClick={() => void signOut()}>
                      <FileText className="h-4 w-4" />
                      Cerrar sesión
                    </button>
                  </div>
                </details>
              </div>
            </header>

            <div className="workspace-banner">{banner}</div>

            <div className="workspace-canvas">
              <div className="workspace-canvas-grid" />
              <div className="workspace-canvas-stack">
                {isLoading ? (
                  <ArtifactShell
                    eyebrow="Cargando"
                    title="Preparando tu lienzo"
                    description="Estamos recuperando perfil, posts, ideas, CV y análisis desde tu workspace."
                    gradient="var(--canvas-accent)"
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="workspace-skeleton" />
                      ))}
                    </div>
                  </ArtifactShell>
                ) : (
                  renderModuleArtifact()
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
