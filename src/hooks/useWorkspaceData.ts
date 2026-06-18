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
  saveProfileAnalysis,
  saveUserProfile,
  updateGeneratedPostStatus,
  uploadResume,
} from "../services/dashboardService";
import { checkAIConnection } from "../services/aiService";
import { debugError, debugLog } from "../utils/debugLogger";
import { initialDashboardState } from "../utils/mockData";
import { isProfessionalProfileComplete } from "../utils/profile";
import { getGenericUserError, userFacingMessages } from "../utils/userFacingMessages";

export function useWorkspaceData() {
  const { userId } = useAuth();
  const [cachedState, setCachedState] = useLocalStorage<DashboardState>(
    "career-linkedin-copilot-state",
    initialDashboardState,
  );
  const [state, setState] = useState<DashboardState>(cachedState);
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState<string>(userFacingMessages.workspace.connecting);

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
          setBanner(userFacingMessages.workspace.localMode);
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
          setBanner(aiStatus.message);
        }
      } catch (error) {
        if (!ignore) {
          debugError("Workspace bootstrap failed.", error);
          setBanner(getGenericUserError("workspace"));
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
          setBanner(userFacingMessages.workspace.profileSaved);
          return;
        }

        setBanner(userFacingMessages.workspace.profileSaved);
      },
      async saveInitialProfileAnalysis(profileAnalysis: NonNullable<DashboardState["profileAnalysis"]>) {
        setState((current) => ({ ...current, profileAnalysis }));

        if (userId && userId !== "local-user") {
          await saveProfileAnalysis(userId, profileAnalysis);
          debugLog("Initial profile analysis saved remotely.");
          setBanner(userFacingMessages.workspace.analysisSaved);
          return;
        }

        setBanner(userFacingMessages.workspace.analysisSaved);
      },
      async createPost(post: GeneratedPost) {
        const persistedPost =
          userId && userId !== "local-user" ? await createGeneratedPost(userId, post) : post;

        setState((current) => ({ ...current, posts: [persistedPost, ...current.posts] }));
        setBanner(userFacingMessages.workspace.postCreated);
      },
      async setPostStatus(id: string, status: PostStatus) {
        if (userId && userId !== "local-user") {
          await updateGeneratedPostStatus(userId, id, status);
        }

        setState((current) => ({
          ...current,
          posts: current.posts.map((post) => (post.id === id ? { ...post, status } : post)),
        }));
        setBanner(`Actualizamos el estado del post a ${status}.`);
      },
      async deletePost(id: string) {
        if (userId && userId !== "local-user") {
          await removeGeneratedPost(userId, id);
        }

        setState((current) => ({
          ...current,
          posts: current.posts.filter((post) => post.id !== id),
        }));
        setBanner(userFacingMessages.workspace.postDeleted);
      },
      async refreshIdeas(ideas: DashboardState["ideas"]) {
        const persistedIdeas =
          userId && userId !== "local-user" ? await replaceContentIdeas(userId, ideas) : ideas;

        setState((current) => ({ ...current, ideas: persistedIdeas }));
        setBanner(userFacingMessages.workspace.ideasRefreshed);
      },
      async uploadResumeFile(file: File) {
        if (userId && userId !== "local-user") {
          const resume = await uploadResume(userId, file);
          setState((current) => ({ ...current, resume }));
          setBanner(userFacingMessages.workspace.resumeUploaded);
          return;
        }

        throw new Error(userFacingMessages.workspace.uploadRequiresSession);
      },
      async saveAssessment(
        assessment: DashboardState["assessment"],
        roadmap: DashboardState["roadmap"],
      ) {
        if (userId && userId !== "local-user") {
          await saveAssessmentAndRoadmap(userId, assessment, roadmap);
        }

        setState((current) => ({ ...current, assessment, roadmap }));
        setBanner(userFacingMessages.workspace.assessmentSaved);
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
