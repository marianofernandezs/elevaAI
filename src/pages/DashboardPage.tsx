import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import CareerPanel from "../components/career/CareerPanel";
import IdeasPanel from "../components/dashboard/IdeasPanel";
import PostGenerator from "../components/posts/PostGenerator";
import PostLibrary from "../components/posts/PostLibrary";
import ProfileForm from "../components/profile/ProfileForm";
import ResumeUploader from "../components/resume/ResumeUploader";
import SectionHeading from "../components/ui/SectionHeading";
import { useAuth } from "../contexts/AuthContext";
import { checkAIConnection } from "../services/aiService";
import type { DashboardState, GeneratedPost, PostStatus } from "../types";
import {
  createGeneratedPost,
  loadDashboardState,
  removeGeneratedPost,
  replaceContentIdeas,
  saveAssessmentAndRoadmap,
  saveUserProfile,
  updateGeneratedPostStatus,
  uploadResume,
} from "../services/dashboardService";
import { initialDashboardState } from "../utils/mockData";

export default function DashboardPage() {
  const { signOut, userEmail, userId } = useAuth();
  const [state, setState] = useState<DashboardState>(initialDashboardState);
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState("Conectando tu workspace con Supabase y validando la sesión...");

  useEffect(() => {
    let ignore = false;

    async function bootstrap() {
      if (!userId || userId === "local-user") {
        setIsLoading(false);
        setBanner("Modo local activo. Configura Supabase para persistencia real entre sesiones.");
        return;
      }

      try {
        setIsLoading(true);
        const nextState = await loadDashboardState(userId);
        const aiStatus = await checkAIConnection();
        if (!ignore) {
          setState(nextState);
          setBanner(`Dashboard conectado con Supabase. ${aiStatus.message}`);
        }
      } catch (error) {
        if (!ignore) {
          setBanner(error instanceof Error ? error.message : "No pudimos cargar tu información.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void bootstrap();

    return () => {
      ignore = true;
    };
  }, [userId]);

  async function upsertPost(post: GeneratedPost) {
    try {
      const persistedPost =
        userId && userId !== "local-user" ? await createGeneratedPost(userId, post) : post;

      setState((current) => ({ ...current, posts: [persistedPost, ...current.posts] }));
      setBanner("Nuevo post generado y guardado en Supabase.");
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "No pudimos guardar el post.");
    }
  }

  async function handleProfileChange(profile: DashboardState["profile"]) {
    try {
      setState((current) => ({ ...current, profile }));

      if (userId && userId !== "local-user") {
        await saveUserProfile(userId, profile);
        setBanner("Perfil actualizado y persistido en Supabase.");
        return;
      }

      setBanner("Perfil actualizado en modo local.");
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "No pudimos guardar el perfil.");
    }
  }

  async function handleUpdatePostStatus(id: string, status: PostStatus) {
    try {
      if (userId && userId !== "local-user") {
        await updateGeneratedPostStatus(userId, id, status);
      }

      setState((current) => ({
        ...current,
        posts: current.posts.map((post) => (post.id === id ? { ...post, status } : post)),
      }));
      setBanner(`Estado actualizado a ${status} y sincronizado.`);
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "No pudimos actualizar el estado del post.");
    }
  }

  async function handleDeletePost(id: string) {
    try {
      if (userId && userId !== "local-user") {
        await removeGeneratedPost(userId, id);
      }

      setState((current) => ({
        ...current,
        posts: current.posts.filter((post) => post.id !== id),
      }));
      setBanner("Post eliminado de la biblioteca y de Supabase.");
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "No pudimos eliminar el post.");
    }
  }

  async function handleRefreshIdeas(ideas: DashboardState["ideas"]) {
    try {
      const persistedIdeas =
        userId && userId !== "local-user" ? await replaceContentIdeas(userId, ideas) : ideas;

      setState((current) => ({ ...current, ideas: persistedIdeas }));
      setBanner("Ideas regeneradas y guardadas.");
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "No pudimos guardar las ideas.");
    }
  }

  async function handleUploadResume(file: File) {
    try {
      if (userId && userId !== "local-user") {
        const resume = await uploadResume(userId, file);
        setState((current) => ({ ...current, resume }));
        setBanner("CV subido a Supabase Storage y texto extraído correctamente.");
        return;
      }

      setBanner("El upload real requiere una sesión válida de Supabase.");
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "No pudimos subir el CV.");
    }
  }

  async function handleAssessmentUpdate(
    assessment: DashboardState["assessment"],
    roadmap: DashboardState["roadmap"],
  ) {
    try {
      if (userId && userId !== "local-user") {
        await saveAssessmentAndRoadmap(userId, assessment, roadmap);
      }

      setState((current) => ({ ...current, assessment, roadmap }));
      setBanner("Skill Gap Analysis y roadmap sincronizados.");
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "No pudimos guardar el análisis.");
    }
  }

  return (
    <AppShell email={userEmail} onSignOut={signOut}>
      <div className="surface overflow-hidden">
        <div className="grid gap-5 border-b border-slate-100 p-6 lg:grid-cols-[1fr_260px] lg:items-center">
          <SectionHeading
            eyebrow="Dashboard"
            title="Tu centro de control profesional"
            description="Gestiona perfil, contenido, CV, skill gap y roadmap desde una sola experiencia enfocada en tiempo al mercado."
          />
          <div className="rounded-3xl bg-amber-50 p-5 text-sm leading-7 text-slate-700">{banner}</div>
        </div>
      </div>

      {isLoading ? (
        <div className="surface p-6 text-sm font-semibold text-slate-600">
          Cargando datos desde Supabase...
        </div>
      ) : (
        <>
          <ProfileForm profile={state.profile} onChange={handleProfileChange} />

          <PostGenerator profile={state.profile} onPostCreated={upsertPost} />
          <PostLibrary posts={state.posts} onUpdateStatus={handleUpdatePostStatus} onDelete={handleDeletePost} />
          <IdeasPanel profile={state.profile} ideas={state.ideas} onRefresh={handleRefreshIdeas} />
          <ResumeUploader resume={state.resume} onUpload={handleUploadResume} />
          <CareerPanel
            profile={state.profile}
            resume={state.resume}
            assessment={state.assessment}
            roadmap={state.roadmap}
            onUpdate={handleAssessmentUpdate}
          />
        </>
      )}
    </AppShell>
  );
}
