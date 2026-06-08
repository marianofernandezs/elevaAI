import { useState } from "react";
import AppShell from "../components/layout/AppShell";
import CareerPanel from "../components/career/CareerPanel";
import IdeasPanel from "../components/dashboard/IdeasPanel";
import PostGenerator from "../components/posts/PostGenerator";
import PostLibrary from "../components/posts/PostLibrary";
import ProfileForm from "../components/profile/ProfileForm";
import ResumeUploader from "../components/resume/ResumeUploader";
import SectionHeading from "../components/ui/SectionHeading";
import { useAuth } from "../contexts/AuthContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { DashboardState, GeneratedPost, PostStatus } from "../types";
import { initialDashboardState } from "../utils/mockData";

export default function DashboardPage() {
  const { signOut, userEmail } = useAuth();
  const [state, setState] = useLocalStorage<DashboardState>("career-linkedin-copilot-state", initialDashboardState);
  const [banner, setBanner] = useState("Modo MVP activo: si configuras Supabase y OpenRouter, esta misma interfaz ya queda lista para conectarse.");

  function upsertPost(post: GeneratedPost) {
    setState((current) => ({ ...current, posts: [post, ...current.posts] }));
    setBanner("Nuevo post generado y guardado en la biblioteca.");
  }

  function updatePostStatus(id: string, status: PostStatus) {
    setState((current) => ({
      ...current,
      posts: current.posts.map((post) => (post.id === id ? { ...post, status } : post)),
    }));
    setBanner(`Estado actualizado a ${status}.`);
  }

  function deletePost(id: string) {
    setState((current) => ({
      ...current,
      posts: current.posts.filter((post) => post.id !== id),
    }));
    setBanner("Post eliminado de la biblioteca.");
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

      <ProfileForm
        profile={state.profile}
        onChange={(profile) => {
          setState((current) => ({ ...current, profile }));
          setBanner("Perfil actualizado. Tus próximos prompts usarán este contexto.");
        }}
      />

      <PostGenerator profile={state.profile} onPostCreated={upsertPost} />
      <PostLibrary posts={state.posts} onUpdateStatus={updatePostStatus} onDelete={deletePost} />
      <IdeasPanel
        profile={state.profile}
        ideas={state.ideas}
        onRefresh={(ideas) => {
          setState((current) => ({ ...current, ideas }));
          setBanner("Ideas regeneradas con el contexto actual del perfil.");
        }}
      />
      <ResumeUploader
        resume={state.resume}
        onUpload={(resume) => {
          setState((current) => ({ ...current, resume }));
          setBanner("CV cargado correctamente. Ya puedes recalcular el análisis.");
        }}
      />
      <CareerPanel
        profile={state.profile}
        resume={state.resume}
        assessment={state.assessment}
        roadmap={state.roadmap}
        onUpdate={(assessment, roadmap) => {
          setState((current) => ({ ...current, assessment, roadmap }));
          setBanner("Skill Gap Analysis y roadmap actualizados.");
        }}
      />
    </AppShell>
  );
}
