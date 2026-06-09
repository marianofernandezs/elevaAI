import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocalStorage } from "./useLocalStorage";
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
import { checkAIConnection } from "../services/aiService";
import { initialDashboardState } from "../utils/mockData";
import { isProfessionalProfileComplete } from "../utils/profile";

export function useWorkspaceData() {
  const { userId } = useAuth();
  const [cachedState, setCachedState] = useLocalStorage<DashboardState>(
    "career-linkedin-copilot-state",
    initialDashboardState,
  );
  const [state, setState] = useState<DashboardState>(cachedState);
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState("Conectando tu workspace con Supabase y validando la sesión...");

  useEffect(() => {
    setCachedState(state);
  }, [state, setCachedState]);

  useEffect(() => {
    let ignore = false;

    async function bootstrap() {
      if (!userId) {
        if (!ignore) {
          setIsLoading(false);
        }
        return;
      }

      if (userId === "local-user") {
        if (!ignore) {
          setIsLoading(false);
          setBanner("Modo local activo. Puedes probar onboarding y workspace sin Supabase.");
        }
        return;
      }

      try {
        setIsLoading(true);
        const [nextState, aiStatus] = await Promise.all([
          loadDashboardState(userId),
          checkAIConnection(),
        ]);

        if (!ignore) {
          setState(nextState);
          setBanner(`Workspace conectado. ${aiStatus.message}`);
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

  const actions = useMemo(
    () => ({
      async saveProfile(profile: DashboardState["profile"]) {
        setState((current) => ({ ...current, profile }));

        if (userId && userId !== "local-user") {
          await saveUserProfile(userId, profile);
          setBanner("Perfil actualizado y persistido en Supabase.");
          return;
        }

        setBanner("Perfil actualizado en modo local.");
      },
      async createPost(post: GeneratedPost) {
        const persistedPost =
          userId && userId !== "local-user" ? await createGeneratedPost(userId, post) : post;

        setState((current) => ({ ...current, posts: [persistedPost, ...current.posts] }));
        setBanner("Nuevo post generado y guardado.");
      },
      async setPostStatus(id: string, status: PostStatus) {
        if (userId && userId !== "local-user") {
          await updateGeneratedPostStatus(userId, id, status);
        }

        setState((current) => ({
          ...current,
          posts: current.posts.map((post) => (post.id === id ? { ...post, status } : post)),
        }));
        setBanner(`Estado actualizado a ${status}.`);
      },
      async deletePost(id: string) {
        if (userId && userId !== "local-user") {
          await removeGeneratedPost(userId, id);
        }

        setState((current) => ({
          ...current,
          posts: current.posts.filter((post) => post.id !== id),
        }));
        setBanner("Post eliminado.");
      },
      async refreshIdeas(ideas: DashboardState["ideas"]) {
        const persistedIdeas =
          userId && userId !== "local-user" ? await replaceContentIdeas(userId, ideas) : ideas;

        setState((current) => ({ ...current, ideas: persistedIdeas }));
        setBanner("Ideas regeneradas.");
      },
      async uploadResumeFile(file: File) {
        if (userId && userId !== "local-user") {
          const resume = await uploadResume(userId, file);
          setState((current) => ({ ...current, resume }));
          setBanner("CV subido a Supabase Storage y analizado.");
          return;
        }

        throw new Error("El upload real requiere una sesión válida de Supabase.");
      },
      async saveAssessment(
        assessment: DashboardState["assessment"],
        roadmap: DashboardState["roadmap"],
      ) {
        if (userId && userId !== "local-user") {
          await saveAssessmentAndRoadmap(userId, assessment, roadmap);
        }

        setState((current) => ({ ...current, assessment, roadmap }));
        setBanner("Skill Gap Analysis y roadmap sincronizados.");
      },
      setBanner,
    }),
    [userId],
  );

  return {
    state,
    isLoading,
    banner,
    profileComplete: isProfessionalProfileComplete(state.profile),
    ...actions,
  };
}
