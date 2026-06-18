import type { UserProfile } from "../types";

export interface InitialDiagnosisInput {
  name?: string;
  profession?: string;
  industry?: string;
  country?: string;
  experienceLevel?: string;
  targetAudience?: string;
  careerGoal?: string;
  brandGoal?: string;
  communicationStyle?: string;
  topics?: string[];
}

export interface InitialDiagnosisResult {
  positioning: string;
  opportunity: string;
  risk: string;
  recommendedActions: {
    title: string;
    description: string;
    action: "create_post" | "improve_profile" | "upload_cv" | "generate_roadmap";
  }[];
}

export function buildInitialDiagnosis(input: InitialDiagnosisInput): InitialDiagnosisResult {
  const profession = input.profession || "profesional";
  const industry = input.industry || "tu industria";
  const audience = input.targetAudience || "tu audiencia objetivo";
  const goal = input.careerGoal || input.brandGoal || "mejorar tu posicionamiento profesional";
  const experienceLevel = input.experienceLevel || "tu etapa actual";
  const communicationStyle = input.communicationStyle || "claro y útil";
  const topics = input.topics?.filter(Boolean) ?? [];

  const evidenceHint =
    topics.length > 0
      ? `Tus temas más naturales hoy parecen ser ${topics.slice(0, 3).join(", ")}.`
      : "Todavía necesitamos volver más visible tu experiencia en contenidos concretos.";

  return {
    positioning: `Actualmente te estás posicionando como ${profession} en ${industry}. Estás en ${experienceLevel} y tienes potencial para conectar con ${audience} si tu narrativa comunica mejor qué haces, para quién y por qué importa.`,
    opportunity: `Tu mayor oportunidad es convertir tu experiencia, aprendizajes y proyectos en contenido concreto con un tono ${communicationStyle}. ${evidenceHint} Eso puede ayudarte a generar confianza, visibilidad y mejores oportunidades relacionadas con tu objetivo: ${goal}.`,
    risk: "El principal riesgo es sonar demasiado genérico. Si tu perfil y contenido no muestran proyectos, logros, aprendizajes o una propuesta de valor reconocible, será difícil diferenciarte frente a otros perfiles similares.",
    recommendedActions: [
      {
        title: "Crear tu primer post de posicionamiento",
        description: "Publica una historia breve sobre quién eres, qué estás construyendo y hacia dónde quieres avanzar profesionalmente.",
        action: "create_post",
      },
      {
        title: "Mejorar tu perfil profesional",
        description: "Ajusta tu titular, resumen y propuesta de valor para que comuniquen mejor tu objetivo.",
        action: "improve_profile",
      },
      {
        title: "Subir tu CV para detectar brechas",
        description: "Analiza qué habilidades, experiencia o evidencia te falta mostrar para acercarte a mejores oportunidades.",
        action: "upload_cv",
      },
    ],
  };
}

export function buildInitialDiagnosisFromProfile(profile: UserProfile): InitialDiagnosisResult {
  return buildInitialDiagnosis({
    name: profile.fullName || undefined,
    profession: profile.profession || undefined,
    industry: profile.industry || undefined,
    country: profile.country || undefined,
    experienceLevel: profile.yearsOfExperience ? `${profile.yearsOfExperience} años de experiencia` : undefined,
    targetAudience: profile.targetAudience || undefined,
    careerGoal: profile.careerGoal || undefined,
    brandGoal: profile.personalBrandGoal || undefined,
    communicationStyle: profile.communicationStyle || undefined,
    topics: profile.contentTopics
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  });
}
