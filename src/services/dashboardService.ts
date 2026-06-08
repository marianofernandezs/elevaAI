import { captureAppError } from "../lib/sentry";
import { hasSupabaseEnv, supabase, supabaseResumeBucket } from "../lib/supabase";
import type {
  ContentIdea,
  DashboardState,
  GeneratedPost,
  PostStatus,
  ResumeAsset,
  RoadmapItem,
  SkillAssessment,
  UserProfile,
} from "../types";
import { initialDashboardState } from "../utils/mockData";
import { extractResumeText } from "../utils/extractResumeText";

function ensureSupabase() {
  if (!hasSupabaseEnv || !supabase) {
    throw new Error("Supabase no está configurado correctamente.");
  }

  return supabase;
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9.\-_]/g, "-");
}

function mapProfileRecord(record: Record<string, unknown> | null | undefined): UserProfile {
  if (!record) {
    return initialDashboardState.profile;
  }

  return {
    fullName: String(record.full_name ?? initialDashboardState.profile.fullName),
    profession: String(record.profession ?? ""),
    industry: String(record.industry ?? ""),
    country: String(record.country ?? ""),
    yearsOfExperience: String(record.years_of_experience ?? ""),
    targetAudience: String(record.target_audience ?? ""),
    careerGoal: String(record.career_goal ?? ""),
    personalBrandGoal: String(record.personal_brand_goal ?? ""),
    communicationStyle: String(record.communication_style ?? ""),
    contentTopics: String(record.content_topics ?? ""),
    linkedInUrl: String(record.linkedin_url ?? ""),
  };
}

function mapPostRecord(record: Record<string, unknown>): GeneratedPost {
  return {
    id: String(record.id),
    title: String(record.title ?? ""),
    hook: String(record.hook ?? ""),
    content: String(record.content ?? ""),
    hashtags: Array.isArray(record.hashtags) ? record.hashtags.map(String) : [],
    status: (record.status as PostStatus | undefined) ?? "draft",
    type: String(record.post_type ?? ""),
    goal: String(record.goal ?? ""),
    createdAt: String(record.created_at ?? ""),
  };
}

function mapIdeaRecord(record: Record<string, unknown>): ContentIdea {
  return {
    id: String(record.id),
    title: String(record.title ?? ""),
    angle: String(record.angle ?? ""),
    description: String(record.description ?? ""),
    pillar: String(record.pillar ?? ""),
  };
}

function mapResumeRecord(record: Record<string, unknown> | null | undefined, client: ReturnType<typeof ensureSupabase>): ResumeAsset | null {
  if (!record) {
    return null;
  }

  const storagePath = String(record.storage_path ?? "");
  const { data } = client.storage.from(supabaseResumeBucket).getPublicUrl(storagePath);

  return {
    id: String(record.id),
    fileName: String(record.file_name ?? ""),
    uploadedAt: String(record.created_at ?? ""),
    extractedText: String(record.extracted_text ?? ""),
    storagePath,
    publicUrl: data.publicUrl,
  };
}

function mapAssessmentRecord(record: Record<string, unknown> | null | undefined): SkillAssessment {
  if (!record) {
    return initialDashboardState.assessment;
  }

  return {
    competitivenessScore: Number(record.competitiveness_score ?? 0),
    currentSkills: Array.isArray(record.current_skills) ? record.current_skills.map(String) : [],
    missingSkills: Array.isArray(record.missing_skills) ? record.missing_skills.map(String) : [],
    emergingSkills: Array.isArray(record.emerging_skills) ? record.emerging_skills.map(String) : [],
    strengths: Array.isArray(record.strengths) ? record.strengths.map(String) : [],
    weaknesses: Array.isArray(record.weaknesses) ? record.weaknesses.map(String) : [],
  };
}

function mapRoadmapRecord(record: Record<string, unknown>): RoadmapItem {
  return {
    horizon: record.horizon as RoadmapItem["horizon"],
    skill: String(record.skill ?? ""),
    priority: record.priority as RoadmapItem["priority"],
    reason: String(record.reason ?? ""),
    expectedImpact: String(record.expected_impact ?? ""),
  };
}

export async function loadDashboardState(userId: string): Promise<DashboardState> {
  const client = ensureSupabase();

  const [
    profileResult,
    postsResult,
    ideasResult,
    resumeResult,
    assessmentResult,
    roadmapResult,
  ] = await Promise.all([
    client.from("user_profiles").select("*").eq("user_id", userId).maybeSingle(),
    client.from("generated_posts").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    client.from("content_ideas").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    client.from("resumes").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    client.from("skill_assessments").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    client.from("learning_roadmaps").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
  ]);

  const results = [profileResult, postsResult, ideasResult, resumeResult, assessmentResult, roadmapResult];
  const failed = results.find((result) => result.error);
  if (failed?.error) {
    captureAppError(failed.error, { scope: "dashboard:load" });
    throw new Error("No pudimos cargar tu dashboard desde Supabase.");
  }

  return {
    profile: mapProfileRecord(profileResult.data as Record<string, unknown> | null | undefined),
    posts: (postsResult.data ?? []).map((record) => mapPostRecord(record as Record<string, unknown>)),
    ideas: (ideasResult.data ?? []).map((record) => mapIdeaRecord(record as Record<string, unknown>)),
    resume: mapResumeRecord(resumeResult.data as Record<string, unknown> | null | undefined, client),
    assessment: mapAssessmentRecord(assessmentResult.data as Record<string, unknown> | null | undefined),
    roadmap: roadmapResult.data && roadmapResult.data.length > 0
      ? roadmapResult.data.map((record) => mapRoadmapRecord(record as Record<string, unknown>))
      : initialDashboardState.roadmap,
  };
}

export async function saveUserProfile(userId: string, profile: UserProfile) {
  const client = ensureSupabase();
  const { error } = await client.from("user_profiles").upsert(
    {
      user_id: userId,
      full_name: profile.fullName,
      profession: profile.profession,
      industry: profile.industry,
      country: profile.country,
      years_of_experience: Number(profile.yearsOfExperience || 0),
      target_audience: profile.targetAudience,
      career_goal: profile.careerGoal,
      personal_brand_goal: profile.personalBrandGoal,
      communication_style: profile.communicationStyle,
      content_topics: profile.contentTopics,
      linkedin_url: profile.linkedInUrl,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    captureAppError(error, { scope: "dashboard:saveProfile" });
    throw new Error("No pudimos guardar tu perfil.");
  }
}

export async function createGeneratedPost(userId: string, post: GeneratedPost) {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("generated_posts")
    .insert({
      user_id: userId,
      title: post.title,
      hook: post.hook,
      content: post.content,
      hashtags: post.hashtags,
      status: post.status,
      post_type: post.type,
      goal: post.goal,
    })
    .select("*")
    .single();

  if (error) {
    captureAppError(error, { scope: "dashboard:createPost" });
    throw new Error("No pudimos guardar el post generado.");
  }

  return mapPostRecord(data as Record<string, unknown>);
}

export async function updateGeneratedPostStatus(userId: string, postId: string, status: PostStatus) {
  const client = ensureSupabase();
  const { error } = await client
    .from("generated_posts")
    .update({ status })
    .eq("id", postId)
    .eq("user_id", userId);

  if (error) {
    captureAppError(error, { scope: "dashboard:updatePostStatus" });
    throw new Error("No pudimos actualizar el estado del post.");
  }
}

export async function removeGeneratedPost(userId: string, postId: string) {
  const client = ensureSupabase();
  const { error } = await client.from("generated_posts").delete().eq("id", postId).eq("user_id", userId);

  if (error) {
    captureAppError(error, { scope: "dashboard:deletePost" });
    throw new Error("No pudimos eliminar el post.");
  }
}

export async function replaceContentIdeas(userId: string, ideas: ContentIdea[]) {
  const client = ensureSupabase();
  const { error: deleteError } = await client.from("content_ideas").delete().eq("user_id", userId);
  if (deleteError) {
    captureAppError(deleteError, { scope: "dashboard:replaceIdeas:delete" });
    throw new Error("No pudimos reemplazar tus ideas.");
  }

  const { data, error } = await client
    .from("content_ideas")
    .insert(
      ideas.map((idea) => ({
        user_id: userId,
        title: idea.title,
        angle: idea.angle,
        description: idea.description,
        pillar: idea.pillar,
      })),
    )
    .select("*");

  if (error) {
    captureAppError(error, { scope: "dashboard:replaceIdeas:insert" });
    throw new Error("No pudimos guardar las ideas generadas.");
  }

  return (data ?? []).map((record) => mapIdeaRecord(record as Record<string, unknown>));
}

export async function uploadResume(userId: string, file: File) {
  const client = ensureSupabase();
  const extractedText = await extractResumeText(file);
  const storagePath = `${userId}/${Date.now()}-${sanitizeFileName(file.name)}`;

  const { error: uploadError } = await client.storage.from(supabaseResumeBucket).upload(storagePath, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (uploadError) {
    captureAppError(uploadError, { scope: "dashboard:uploadResume:file" });
    throw new Error("No pudimos subir el CV a Supabase Storage.");
  }

  const { data, error } = await client
    .from("resumes")
    .insert({
      user_id: userId,
      file_name: file.name,
      storage_path: storagePath,
      extracted_text: extractedText,
    })
    .select("*")
    .single();

  if (error) {
    captureAppError(error, { scope: "dashboard:uploadResume:record" });
    throw new Error("El archivo se subió, pero no pudimos registrar el CV en la base de datos.");
  }

  return mapResumeRecord(data as Record<string, unknown>, client);
}

export async function saveAssessmentAndRoadmap(
  userId: string,
  assessment: SkillAssessment,
  roadmap: RoadmapItem[],
) {
  const client = ensureSupabase();

  const { error: deleteAssessmentError } = await client
    .from("skill_assessments")
    .delete()
    .eq("user_id", userId);
  if (deleteAssessmentError) {
    captureAppError(deleteAssessmentError, { scope: "dashboard:saveAssessment:deleteAssessment" });
    throw new Error("No pudimos actualizar el análisis de skills.");
  }

  const { error: deleteRoadmapError } = await client
    .from("learning_roadmaps")
    .delete()
    .eq("user_id", userId);
  if (deleteRoadmapError) {
    captureAppError(deleteRoadmapError, { scope: "dashboard:saveAssessment:deleteRoadmap" });
    throw new Error("No pudimos actualizar el roadmap.");
  }

  const { error: insertAssessmentError } = await client.from("skill_assessments").insert({
    user_id: userId,
    competitiveness_score: assessment.competitivenessScore,
    current_skills: assessment.currentSkills,
    missing_skills: assessment.missingSkills,
    emerging_skills: assessment.emergingSkills,
    strengths: assessment.strengths,
    weaknesses: assessment.weaknesses,
  });

  if (insertAssessmentError) {
    captureAppError(insertAssessmentError, { scope: "dashboard:saveAssessment:insertAssessment" });
    throw new Error("No pudimos guardar el análisis de skills.");
  }

  const { error: insertRoadmapError } = await client.from("learning_roadmaps").insert(
    roadmap.map((item) => ({
      user_id: userId,
      horizon: item.horizon,
      skill: item.skill,
      priority: item.priority,
      reason: item.reason,
      expected_impact: item.expectedImpact,
    })),
  );

  if (insertRoadmapError) {
    captureAppError(insertRoadmapError, { scope: "dashboard:saveAssessment:insertRoadmap" });
    throw new Error("No pudimos guardar el roadmap.");
  }
}
