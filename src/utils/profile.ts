import type { ProfileAnalysis, UserProfile } from "../types";

const requiredProfileKeys: Array<keyof UserProfile> = [
  "fullName",
  "profession",
  "industry",
  "country",
  "yearsOfExperience",
  "targetAudience",
  "careerGoal",
  "personalBrandGoal",
  "communicationStyle",
  "contentTopics",
];

export function isProfessionalProfileComplete(profile: UserProfile | null | undefined) {
  if (!profile) {
    return false;
  }

  return requiredProfileKeys.every((key) => profile[key]?.trim().length > 0);
}

export function hasProfileAnalysis(analysis: ProfileAnalysis | null | undefined) {
  if (!analysis) {
    return false;
  }

  return [
    analysis.professionalSummary,
    analysis.niche,
    analysis.industryContext,
    analysis.careerGoalSummary,
    analysis.initialRecommendation,
    analysis.positioningStatement,
  ].every((item) => item.trim().length > 0);
}
