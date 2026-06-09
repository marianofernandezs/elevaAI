import type { UserProfile } from "../types";

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
