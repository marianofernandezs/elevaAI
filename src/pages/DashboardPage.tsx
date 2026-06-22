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
import { debugError } from "../utils/debugLogger";
import { getGenericUserError, userFacingMessages } from "../utils/userFacingMessages";

export default function DashboardPage() {
  const { signOut, userEmail, userId } = useAuth();
  const [state, setState] = useState<DashboardState>(initialDashboardState);
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState<string>(userFacingMessages.workspace.connecting);

  useEffect(() => {
    let ignore = false;

    async function bootstrap() {
      if (!userId || userId === "local-user") {
        setIsLoading(false);
        setBanner(userFacingMessages.workspace.localMode);
        return;
      }

      try {
        setIsLoading(true);
        const nextState = await loadDashboardState(userId);
        const aiStatus = await checkAIConnection();
        if (!ignore) {
          setState(nextState);
          setBanner(aiStatus.message);
        }
      } catch (error) {
        if (!ignore) {
          debugError("Dashboard bootstrap failed.", error);
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

  async function upsertPost(post: GeneratedPost) {
    try {
      const persistedPost =
        userId && userId !== "local-user" ? await createGeneratedPost(userId, post) : post;

      setState((current) => ({ ...current, posts: [persistedPost, ...current.posts] }));
      setBanner(userFacingMessages.workspace.postCreated);
    } catch (error) {
      debugError("Post creation failed.", error);
      setBanner(getGenericUserError("post"));
    }
  }

  async function handleProfileChange(profile: DashboardState["profile"]) {
    try {
      setState((current) => ({ ...current, profile }));

      if (userId && userId !== "local-user") {
        await saveUserProfile(userId, profile);
        setBanner(userFacingMessages.workspace.profileSaved);
        return;
      }

      setBanner(userFacingMessages.workspace.profileSaved);
    } catch (error) {
      debugError("Profile update failed.", error);
      setBanner(getGenericUserError("profile"));
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
      setBanner(`Actualizamos el estado del post a ${status}.`);
    } catch (error) {
      debugError("Post status update failed.", error);
      setBanner(getGenericUserError("post"));
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
      setBanner(userFacingMessages.workspace.postDeleted);
    } catch (error) {
      debugError("Post deletion failed.", error);
      setBanner(getGenericUserError("post"));
    }
  }

  async function handleRefreshIdeas(ideas: DashboardState["ideas"]) {
    try {
      const persistedIdeas =
        userId && userId !== "local-user" ? await replaceContentIdeas(userId, ideas) : ideas;

      setState((current) => ({ ...current, ideas: persistedIdeas }));
      setBanner(userFacingMessages.workspace.ideasRefreshed);
    } catch (error) {
      debugError("Ideas refresh failed.", error);
      setBanner(getGenericUserError("ideas"));
    }
  }

  async function handleUploadResume(file: File) {
    try {
      if (userId && userId !== "local-user") {
        const resume = await uploadResume(userId, file);
        setState((current) => ({ ...current, resume }));
        setBanner(userFacingMessages.workspace.resumeUploaded);
        return;
      }

      setBanner(userFacingMessages.workspace.uploadRequiresSession);
    } catch (error) {
      debugError("Resume upload failed.", error);
      setBanner(getGenericUserError("resume"));
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
      setBanner(userFacingMessages.workspace.assessmentSaved);
    } catch (error) {
      debugError("Assessment update failed.", error);
      setBanner(getGenericUserError("assessment"));
    }
  }

  return (
    <AppShell email={userEmail} onSignOut={signOut}>
      <div className="surface min-w-0 overflow-hidden">
        <div className="grid min-w-0 gap-5 p-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-center">
          <SectionHeading
            eyebrow="Dashboard"
            title="Tu centro de control profesional"
            description="Gestiona perfil, contenido, CV, skill gap y roadmap desde una sola experiencia enfocada en tiempo al mercado."
          />
          <div className="soft-card min-w-0 p-5 text-sm leading-7 text-muted break-words">{banner}</div>
        </div>
      </div>

      {isLoading ? (
        <div className="surface p-6 text-sm font-semibold text-muted">
          Preparando tu información...
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
