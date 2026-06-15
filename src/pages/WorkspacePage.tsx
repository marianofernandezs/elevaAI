import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  FilePenLine,
  FileText,
  FileUp,
  Lightbulb,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
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
import { renderMarkdown } from "../utils/markdown";
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

type ArtifactType =
  | "empty"
  | "welcome"
  | "linkedin_post"
  | "skill_gap"
  | "roadmap"
  | "cv_analysis"
  | "content_ideas"
  | "hooks"
  | "profile"
  | "library";

interface WorkspacePageProps {
  initialModule?: WorkspaceModule;
}

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  text: string;
}

const routeTabs: Array<{ label: string; module: WorkspaceModule; icon: LucideIcon }> = [
  { label: "Workspace", module: "overview", icon: Bot },
  { label: "Perfil", module: "profile", icon: UserCircle2 },
  { label: "CV", module: "resume", icon: Upload },
  { label: "Skill Gap", module: "skills", icon: BarChart3 },
  { label: "Roadmap", module: "roadmap", icon: Sparkles },
  { label: "Biblioteca", module: "library", icon: BookOpen },
];



function buildAvatarLabel(email: string) {
  const base = email.split("@")[0] ?? "EA";
  return (
    base
      .split(/[.\-_]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "EA"
  );
}

function sanitizePreviewText(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\*\*(hook|cuerpo|cta|hashtags?)\*\*:?/gi, " ")
    .replace(/(^|\n)\s*(hook|cuerpo|cta|hashtags?)\s*:?/gi, " ")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/#{1,6}\s*/g, "")
    .replace(/\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\|/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildPreviewExcerpt(body: string) {
  const cleaned = sanitizePreviewText(body);
  if (cleaned.length <= 240) {
    return cleaned;
  }

  return `${cleaned.slice(0, 237).trimEnd()}...`;
}

function buildPostMetrics(post: { content: string; hashtags: string[]; createdAt: string }) {
  const base = post.content.length + post.hashtags.length * 37;

  return [
    { label: "Visualizaciones", value: `${Math.max(2.4, base / 40).toFixed(1)}K` },
    { label: "Likes", value: `${Math.max(180, base * 2)}` },
    { label: "Comentarios", value: `${Math.max(24, Math.round(base / 3))}` },
    { label: "Compartidos", value: `${Math.max(12, Math.round(base / 5))}` },
    { label: "Publicado", value: new Date(post.createdAt).toLocaleDateString("es-CL") },
    { label: "Hashtags", value: `${post.hashtags.length}` },
  ];
}

function ArtifactShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <article className="workspace-artifact workspace-artifact--product">
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
  const cleanHook = sanitizePreviewText(hook);
  const excerpt = buildPreviewExcerpt(body);

  return (
    <div className="workspace-post-preview mx-auto max-w-md">
      <div className="workspace-post-top">
        <div className="workspace-avatar-dot" />
        <div>
          <p className="text-sm font-semibold" style={{ color: "#47311f" }}>
            elevaIA Preview
          </p>
          <p className="text-xs" style={{ color: "#8d6b52" }}>
            Vista previa LinkedIn
          </p>
        </div>
      </div>
      <div className="workspace-post-body">
        <p className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: "#f5c48c" }}>
          {title}
        </p>
        <h4 className="mt-4 text-[2.35rem] font-bold leading-[0.98]" style={{ color: "#fff8ef" }}>
          {cleanHook || "Post listo para revisar"}
        </h4>
        <p className="mt-5 max-w-[28ch] text-[1rem] leading-8" style={{ color: "rgba(255, 236, 214, 0.82)" }}>
          {excerpt}
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

function initialAgentMessage(name: string) {
  const safeName = name || "ahí";
  return `Hola ${safeName} 👋 ¿En qué te puedo ayudar hoy?`;
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
  const [artifact, setArtifact] = useState<ArtifactType>("empty");
  const [chatOpen, setChatOpen] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [isAgentWorking, setIsAgentWorking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const toggleChat = () => setChatOpen((value) => !value);

  useEffect(() => {
    setActiveModule(initialModule);
  }, [initialModule]);

  useEffect(() => {
    const firstName = state.profile.fullName.split(" ")[0] ?? "";
    setMessages([
      {
        id: "agent-welcome",
        role: "agent",
        text: initialAgentMessage(firstName),
      },
    ]);
  }, [state.profile.fullName]);

  useEffect(() => {
    if (initialModule === "overview") {
      setArtifact("empty");
      return;
    }

    const moduleToArtifact: Record<Exclude<WorkspaceModule, "overview">, ArtifactType> = {
      profile: "profile",
      posts: "linkedin_post",
      ideas: "content_ideas",
      resume: "cv_analysis",
      skills: "skill_gap",
      roadmap: "roadmap",
      library: "library",
    };

    setArtifact(moduleToArtifact[initialModule as Exclude<WorkspaceModule, "overview">] ?? "empty");
  }, [initialModule]);

  const recentArtifacts = useMemo(
    () =>
      [
        ...state.posts.slice(0, 3).map((post) => ({
          id: post.id,
          label: post.title,
          artifact: "linkedin_post" as ArtifactType,
        })),
        ...state.ideas.slice(0, 2).map((idea) => ({
          id: idea.id,
          label: idea.title,
          artifact: "content_ideas" as ArtifactType,
        })),
      ].slice(0, 5),
    [state.ideas, state.posts],
  );

  function openArtifact(nextArtifact: ArtifactType) {
    setArtifact(nextArtifact);
    const artifactToModule: Partial<Record<ArtifactType, WorkspaceModule>> = {
      linkedin_post: "posts",
      skill_gap: "skills",
      roadmap: "roadmap",
      cv_analysis: "resume",
      content_ideas: "ideas",
      hooks: "ideas",
      profile: "profile",
      library: "library",
      empty: "overview",
      welcome: "overview",
    };
    setActiveModule(artifactToModule[nextArtifact] ?? "overview");
  }

  async function handleQuickAction(nextArtifact: ArtifactType) {
    openArtifact(nextArtifact);

    if (nextArtifact === "content_ideas") {
      const nextIdeas = await generateIdeas(state.profile);
      await refreshIdeas(nextIdeas);
    }

    if (nextArtifact === "skill_gap" && state.resume) {
      const nextAssessment = await analyzeSkillGap({
        profile: state.profile,
        resumeText: state.resume.extractedText,
      });
      const nextRoadmap = await generateRoadmap(nextAssessment);
      await saveAssessment(nextAssessment, nextRoadmap);
    }
  }

  async function handleAgentSubmit(nextPrompt?: string) {
    const finalPrompt = (nextPrompt ?? prompt).trim();
    if (!finalPrompt) {
      return;
    }

    setIsAgentWorking(true);
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: "user", text: finalPrompt }]);

    try {
      const lowered = finalPrompt.toLowerCase();

      if (lowered.includes("post")) {
        openArtifact("linkedin_post");
        const generatedPost = await generateLinkedInPost({
          profile: state.profile,
          baseIdea: finalPrompt,
          goal: "Aumentar autoridad",
          type: "Storytelling",
          length: "Media",
        });
        await createPost(generatedPost);
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "agent",
            text: "Perfecto. Ya abrí el canvas de post y generé una primera versión para iterarla contigo.",
          },
        ]);
        return;
      }

      if (lowered.includes("hook")) {
        openArtifact("hooks");
        const hooks = await generateHooks({ profile: state.profile, topic: finalPrompt });
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "agent",
            text: `Te dejé el canvas listo para hooks.\n\nHooks sugeridos:\n- ${hooks.slice(0, 3).join("\n- ")}`,
          },
        ]);
        return;
      }

      if (lowered.includes("cv")) {
        openArtifact("cv_analysis");
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "agent",
            text: "Abrí el módulo de CV en el canvas para que subas o vuelvas a analizar tu archivo.",
          },
        ]);
        return;
      }

      if (lowered.includes("skill") || lowered.includes("brecha")) {
        openArtifact("skill_gap");
        if (state.resume) {
          const nextAssessment = await analyzeSkillGap({
            profile: state.profile,
            resumeText: state.resume.extractedText,
          });
          const nextRoadmap = await generateRoadmap(nextAssessment);
          await saveAssessment(nextAssessment, nextRoadmap);
        }
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "agent",
            text: "Abrí el Skill Gap Analysis en el canvas para que revisemos brechas, fortalezas y prioridades.",
          },
        ]);
        return;
      }

      if (lowered.includes("roadmap")) {
        openArtifact("roadmap");
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "agent",
            text: "Ya tienes el canvas enfocado en roadmap para priorizar próximos pasos.",
          },
        ]);
        return;
      }

      if (lowered.includes("idea")) {
        openArtifact("content_ideas");
        const nextIdeas = await generateIdeas(state.profile);
        await refreshIdeas(nextIdeas);
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "agent",
            text: "Generé nuevas ideas de contenido y abrí el canvas para trabajarlas.",
          },
        ]);
        return;
      }

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "agent",
          text: "Puedo ayudarte a crear un post, analizar tu CV, abrir el skill gap, generar roadmap, ideas o hooks. Elige una acción o escríbeme exactamente qué quieres crear.",
        },
      ]);
    } finally {
      setPrompt("");
      setIsAgentWorking(false);
    }
  }

  function renderCanvas() {
    if (isLoading) {
      return (
        <ArtifactShell
          eyebrow="Cargando"
          title="Preparando tu lienzo"
          description="Estamos recuperando tu perfil, posts, CV y análisis guardados."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="workspace-skeleton" />
            ))}
          </div>
        </ArtifactShell>
      );
    }

    switch (artifact) {
      case "profile":
        return (
          <ArtifactShell
            eyebrow="Perfil profesional"
            title="Edita tu contexto base"
            description="Actualiza el perfil que alimenta todos los prompts, análisis y recomendaciones del agente."
          >
            <ProfileForm profile={state.profile} onChange={saveProfile} hideHeader={true} />
          </ArtifactShell>
        );
      case "linkedin_post":
        return (
          <ArtifactShell
            eyebrow="Artifact · LinkedIn Post"
            title={state.posts[0]?.title ?? "Crear primer post"}
            description="Aquí aparece el artefacto del post. Puedes generarlo, revisarlo y seguir iterando desde el chat."
          >
            <div className="space-y-8">
              {state.posts[0] ? (
                <>
                  <LinkedInPreviewCard
                    title={state.posts[0].title}
                    hook={state.posts[0].hook}
                    body={state.posts[0].content}
                  />
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {buildPostMetrics(state.posts[0]).map((metric) => (
                      <div key={metric.label} className="workspace-stat-card">
                        <p className="text-sm" style={{ color: "var(--canvas-muted)" }}>
                          {metric.label}
                        </p>
                        <p className="mt-2 text-4xl font-bold" style={{ color: "var(--canvas-text)" }}>
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
              <PostGenerator profile={state.profile} onPostCreated={createPost} />
            </div>
          </ArtifactShell>
        );
      case "content_ideas":
      case "hooks":
        return (
          <ArtifactShell
            eyebrow={artifact === "hooks" ? "Artifact · Hooks" : "Artifact · Ideas"}
            title={artifact === "hooks" ? "Hooks para LinkedIn" : "Ideas de contenido"}
            description="El canvas muestra ideas y hooks sólo cuando decides abrir este artefacto desde el chat o desde una acción rápida."
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
      case "cv_analysis":
        return (
          <ArtifactShell
            eyebrow="Artifact · CV Analysis"
            title="Analizar CV"
            description="Sube o actualiza tu CV para convertirlo en contexto reusable dentro del agente."
          >
            <ResumeUploader resume={state.resume} onUpload={uploadResumeFile} hideHeader={true} />
          </ArtifactShell>
        );
      case "skill_gap":
        return (
          <ArtifactShell
            eyebrow="Artifact · Skill Gap"
            title="Skill Gap Analysis"
            description="El resultado aparece aquí cuando decides revisar brechas, fortalezas y skills prioritarias."
          >
            <CareerPanel
              profile={state.profile}
              resume={state.resume}
              assessment={state.assessment}
              roadmap={state.roadmap}
              onUpdate={saveAssessment}
              hideHeader={true}
            />
          </ArtifactShell>
        );
      case "roadmap":
        return (
          <ArtifactShell
            eyebrow="Artifact · Roadmap"
            title="Roadmap de upskilling"
            description="Prioriza acciones a 30, 90 días y 6 meses desde un artefacto dedicado del canvas."
          >
            <div className="space-y-4">
              {state.roadmap.length > 0 ? (
                state.roadmap.map((item) => (
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
                ))
              ) : (
                <div className="workspace-mini-card">
                  <p className="text-base leading-7" style={{ color: "var(--canvas-muted)" }}>
                    Todavía no generas un roadmap. Usa el chat o la acción rápida para crearlo.
                  </p>
                </div>
              )}
            </div>
          </ArtifactShell>
        );
      case "library":
        return (
          <ArtifactShell
            eyebrow="Artifact · Biblioteca"
            title="Biblioteca de posts"
            description="Los contenidos guardados viven aquí como artefacto de consulta dentro del canvas."
          >
            <PostLibrary posts={state.posts} onUpdateStatus={setPostStatus} onDelete={deletePost} hideHeader={true} />
          </ArtifactShell>
        );
      case "welcome":
      case "empty":
      default:
        return (
          <div className="workspace-empty-canvas">
            <div className="workspace-empty-canvas__inner">
              <p className="eyebrow">Canvas vacío</p>
              <h2 className="mt-4 text-4xl font-bold" style={{ color: "var(--canvas-text)" }}>
                Tu canvas está listo
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8" style={{ color: "var(--canvas-muted)" }}>
                Los artefactos que genere elevaAI aparecerán aquí: posts, análisis de CV, skill gap, roadmap e ideas de contenido.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { label: "Crear post", artifact: "linkedin_post" as ArtifactType, icon: FilePenLine },
                  { label: "Subir CV", artifact: "cv_analysis" as ArtifactType, icon: Upload },
                  { label: "Generar roadmap", artifact: "roadmap" as ArtifactType, icon: Sparkles },
                ].map(({ label, artifact: nextArtifact, icon: Icon }) => (
                  <button
                    key={label}
                    type="button"
                    className="workspace-empty-action"
                    onClick={() => void handleQuickAction(nextArtifact)}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
    }
  }

  const firstName = state.profile.fullName.split(" ")[0] ?? "Mariano";

  return (
    <div className="workspace-shell min-h-screen">
      <div
        className="grid min-h-screen w-full gap-0 overflow-hidden border workspace-frame"
        style={{ borderColor: "var(--border)", background: "var(--workspace-frame)" }}
      >
        <div className={`workspace-layout ${chatOpen ? "workspace-layout--chat-open" : "workspace-layout--chat-closed"}`}>
          {chatOpen && (
            <aside className="workspace-sidebar workspace-sidebar--chat min-w-0 p-5">
              <div className="workspace-chat-header">
                <div>
                  <h1 className="text-[1.8rem] font-extrabold leading-none" style={{ color: "var(--workspace-chat-text)" }}>elevaIA</h1>
                  <p className="mt-2 text-sm" style={{ color: "var(--workspace-chat-muted)" }}>Agente de IA especializado en LinkedIn</p>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <button
                    type="button"
                    className="workspace-chat-toggle"
                    onClick={toggleChat}
                    aria-label="Ocultar chat"
                    title="Ocultar chat"
                  >
                    <PanelLeftClose className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="workspace-chat-scroll">
                <div className="mt-6 space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`workspace-message-card ${message.role === "user" ? "workspace-message-card--user" : "workspace-message-card--agent"} ${message.role === "agent" ? "workspace-message-card--hero" : ""}`}
                    >
                      <p className="text-sm font-semibold" style={{ color: message.role === "user" ? "white" : "var(--workspace-chat-text)" }}>
                        {message.role === "user" ? firstName : "elevaIA"}
                      </p>
                      <p
                        className="mt-3 whitespace-pre-line text-sm leading-7"
                        style={{ color: message.role === "user" ? "rgba(255,255,255,0.88)" : "var(--workspace-chat-body)" }}
                      >
                        {renderMarkdown(message.text)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-3">
                  {[
                    { label: "Crear primer post", artifact: "linkedin_post" as ArtifactType, icon: FilePenLine },
                  ].map(({ label, artifact: nextArtifact, icon: Icon }) => (
                    <button
                      key={label}
                      type="button"
                      className="workspace-chat-action"
                      onClick={() => void handleQuickAction(nextArtifact)}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mt-6 space-y-2 pr-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--workspace-chat-muted)" }}>
                    Artefactos recientes
                  </p>
                  {recentArtifacts.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="workspace-history-item"
                      onClick={() => openArtifact(item.artifact)}
                    >
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--workspace-chat-text)" }}>{item.label}</p>
                        <p className="mt-1 text-xs" style={{ color: "var(--workspace-chat-muted)" }}>Abrir artefacto en el canvas</p>
                      </div>
                      <ArrowRight className="h-4 w-4" style={{ color: "var(--workspace-chat-muted)" }} />
                    </button>
                  ))}
                </div>

              </div>

              <div className="workspace-chat-composer">
                <textarea
                  className="workspace-prompt"
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
          )}

          <section className="workspace-canvas-wrap workspace-canvas-wrap--primary min-w-0 transition-all duration-300 ease-in-out">
            <header className="workspace-canvas-header">
              <div className={!chatOpen ? "workspace-canvas-header__content workspace-canvas-header__content--with-toggle" : "workspace-canvas-header__content"}>
                <h2 className="text-[2rem] font-bold" style={{ color: "var(--canvas-text)" }}>
                  Canvas de trabajo
                </h2>
                <p className="mt-2 text-sm" style={{ color: "var(--canvas-muted)" }}>
                  El canvas sólo muestra artefactos cuando decides generarlos desde el chat o desde una acción rápida.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {!chatOpen && (
                  <button
                    type="button"
                    className="workspace-chat-toggle workspace-chat-toggle--floating"
                    onClick={toggleChat}
                    aria-label="Mostrar chat"
                    title="Mostrar chat"
                  >
                    <PanelLeftOpen className="h-4 w-4" />
                  </button>
                )}
                <div className="workspace-banner workspace-banner--compact">{banner}</div>
                <details className="relative">
                  <summary className="workspace-avatar-button list-none">
                    <span>{buildAvatarLabel(userEmail)}</span>
                  </summary>
                  <div className="workspace-avatar-menu">
                    {routeTabs.map(({ label, module, icon: Icon }) => (
                      <NavLink
                        key={label}
                        to={module === "overview" ? "/workspace" : module === "posts" ? "/workspace/posts" : module === "ideas" ? "/workspace/ideas" : module === "resume" ? "/resume-upload" : module === "skills" ? "/skill-gap" : module === "roadmap" ? "/roadmap" : module === "profile" ? "/profile" : "/library"}
                        className="workspace-avatar-menu__item"
                        onClick={() => {
                          setActiveModule(module);
                          if (module === "overview") {
                            setArtifact("empty");
                          }
                        }}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </NavLink>
                    ))}
                    <NavLink to="/settings" className="workspace-avatar-menu__item">
                      <Settings className="h-4 w-4" />
                      Configuración
                    </NavLink>
                    <button type="button" className="workspace-avatar-menu__item" onClick={() => void signOut()}>
                      <FileText className="h-4 w-4" />
                      Cerrar sesión
                    </button>
                  </div>
                </details>
              </div>
            </header>

            <div className="workspace-canvas workspace-canvas--artifact">
              <div className="workspace-canvas-grid" />
              <div className="workspace-canvas-stack workspace-canvas-stack--artifact">{renderCanvas()}</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
