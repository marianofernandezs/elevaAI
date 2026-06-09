export type PostStatus = "draft" | "published" | "archived";

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
