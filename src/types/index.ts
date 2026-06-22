export type PostStatus = "draft" | "published" | "archived";
export type ThemePreference = "light" | "dark" | "system";

export interface UserProfile {
  fullName: string;
  profession: string;
  industry: string;
  country: string;
  yearsOfExperience: string;
  targetAudience: string;
  careerGoal: string;
  personalBrandGoal: string;
  communicationStyle: string;
  contentTopics: string;
  linkedInUrl: string;
}

export interface GeneratedPost {
  id: string;
  title: string;
  hook: string;
  content: string;
  hashtags: string[];
  status: PostStatus;
  type: string;
  goal: string;
  createdAt: string;
}

export interface ContentIdea {
  id: string;
  title: string;
  angle: string;
  description: string;
  pillar: string;
}

export interface ResumeAsset {
  id?: string;
  fileName: string;
  uploadedAt: string;
  extractedText: string;
  storagePath?: string;
  publicUrl?: string;
}

export interface ProfileAnalysis {
  professionalSummary: string;
  niche: string;
  industryContext: string;
  careerGoalSummary: string;
  linkedInOpportunities: string[];
  prioritySkills: string[];
  initialRecommendation: string;
  positioningStatement: string;
  topOpportunities: string[];
  recommendedActions: string[];
}

export interface SkillAssessment {
  competitivenessScore: number;
  currentSkills: string[];
  missingSkills: string[];
  emergingSkills: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface RoadmapItem {
  horizon: "30 días" | "90 días" | "6 meses";
  skill: string;
  priority: "Alta" | "Media" | "Baja";
  reason: string;
  expectedImpact: string;
}

export interface DashboardState {
  profile: UserProfile;
  profileAnalysis: ProfileAnalysis | null;
  posts: GeneratedPost[];
  ideas: ContentIdea[];
  resume: ResumeAsset | null;
  assessment: SkillAssessment;
  roadmap: RoadmapItem[];
}

export interface UserSettings {
  displayName: string;
  preferredLanguage: string;
  preferredAiTone: string;
  responseDetailLevel: "brief" | "normal" | "detailed";
  mainGoal: "Conseguir empleo" | "Atraer clientes" | "Construir autoridad" | "Networking" | "Aprender nuevas habilidades";
  linkedinFrequency: "1 vez por semana" | "2 veces por semana" | "3 veces por semana" | "Diario";
  favoriteContentStyle: "Storytelling" | "Técnico" | "Educativo" | "Opinión" | "Experiencias personales";
  preferredCtaStyle: "Suave" | "Directo" | "Sin CTA";
  theme: ThemePreference;
}
