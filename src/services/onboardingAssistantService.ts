import type { UserProfile } from "../types";

export interface OnboardingHelpRequest {
  step: string;
  profession?: string;
  experienceLevel?: string;
  careerGoal?: string;
  userFocus?: string;
}

export interface OnboardingHelpResponse {
  explanation: string;
  examples: string[];
  suggestion?: string;
}

const helpContent: Record<
  string,
  {
    explanation: string;
    examples: string[];
    suggestion: (request: OnboardingHelpRequest) => string | undefined;
  }
> = {
  fullName: {
    explanation: "Usa el nombre con el que quieres presentarte profesionalmente. Si luego quieres ajustar cómo apareces públicamente, podrás hacerlo.",
    examples: ["Mariano Fernández", "Camila Soto", "Ignacio Pérez"],
    suggestion: (request) => request.userFocus || undefined,
  },
  profession: {
    explanation: "Describe tu rol de la forma más clara posible. No buscamos el título perfecto, solo una versión que otra persona entienda rápido.",
    examples: ["Desarrollador Frontend", "Product Manager", "Diseñadora UX/UI", "Analista de Datos"],
    suggestion: (request) => request.userFocus || request.profession,
  },
  industry: {
    explanation: "Piensa en el sector donde aportas valor hoy o en el que quieres posicionarte. Puede ser amplio al principio.",
    examples: ["Software", "SaaS B2B", "Educación", "Fintech", "Marketing digital"],
    suggestion: (request) => request.userFocus || undefined,
  },
  country: {
    explanation: "Esto nos ayuda a adaptar contexto, tono y oportunidades a tu mercado principal.",
    examples: ["Chile", "México", "Colombia", "España"],
    suggestion: (request) => request.userFocus || undefined,
  },
  yearsOfExperience: {
    explanation: "No tiene que ser exacto al mes. Solo necesitamos una idea general de tu etapa profesional.",
    examples: ["1", "3", "5", "8"],
    suggestion: (request) => request.userFocus || request.experienceLevel,
  },
  targetAudience: {
    explanation: "Piensa en quién quieres que entienda tu valor o te descubra con más frecuencia.",
    examples: ["Reclutadores tecnológicos", "Empresas SaaS", "Emprendedores", "Profesionales junior", "Líderes de producto"],
    suggestion: (request) => {
      const focusText = request.userFocus
        ? `, especialmente en el ámbito de ${request.userFocus.toLowerCase()}`
        : "";

      if (!request.profession) {
        return `Quiero conectar con personas que valoren mi trabajo y puedan abrirme oportunidades alineadas con mi perfil${focusText}.`;
      }

      return `Quiero conectar con recruiters, líderes y equipos que busquen talento en ${request.profession.toLowerCase()}${focusText}.`;
    },
  },
  careerGoal: {
    explanation: "Describe el tipo de cambio u oportunidad que te gustaría provocar con tu posicionamiento profesional.",
    examples: ["Conseguir trabajo remoto", "Cambiar de industria", "Conseguir más clientes", "Posicionarme como experto", "Encontrar oportunidades de liderazgo"],
    suggestion: (request) => {
      if (request.userFocus) {
        return `Mi objetivo principal es ${request.userFocus.toLowerCase()} y consolidar mi crecimiento en esta área.`;
      }
      if (request.careerGoal) {
        return request.careerGoal;
      }
      return "Quiero fortalecer mi posicionamiento profesional para atraer mejores oportunidades alineadas con mi crecimiento.";
    },
  },
  linkedInUrl: {
    explanation: "Es opcional. Si ya tienes LinkedIn, nos sirve para complementar tu contexto más adelante.",
    examples: ["https://www.linkedin.com/in/tu-perfil"],
    suggestion: () => undefined,
  },
  personalBrandGoal: {
    explanation: "Aquí definimos cómo quieres ser recordado profesionalmente. No hace falta que suene perfecto todavía.",
    examples: [
      "Quiero posicionarme como alguien que comparte aprendizajes reales",
      "Quiero atraer oportunidades por mi claridad técnica y enfoque práctico",
      "Quiero construir una marca personal confiable y útil",
    ],
    suggestion: (request) => {
      const focusText = request.userFocus
        ? `, destacando mi especialización en ${request.userFocus.toLowerCase()}`
        : "";
      return `Quiero posicionarme como ${
        request.profession?.toLowerCase() ?? "un profesional"
      } que comparte aprendizajes reales, proyectos y buenas prácticas${focusText} para generar confianza.`;
    },
  },
  communicationStyle: {
    explanation: "Piensa en cómo quieres sonar cuando la IA escriba contigo: más cercano, más técnico, más estratégico o más simple.",
    examples: ["Cercano y claro", "Estratégico y accionable", "Técnico pero fácil de entender", "Humano y profesional"],
    suggestion: (request) => {
      if (request.userFocus) {
        return `Quiero sonar ${request.userFocus.toLowerCase()}, manteniendo la claridad y profesionalismo.`;
      }
      return "Quiero sonar cercano, claro y profesional, con ideas fáciles de entender y útiles para otros.";
    },
  },
  contentTopics: {
    explanation: "Elige temas sobre los que puedas hablar con ejemplos, aprendizajes o puntos de vista propios.",
    examples: ["Aprendizajes profesionales", "Casos reales", "Productividad", "Tecnología", "Liderazgo", "Desarrollo de carrera"],
    suggestion: (request) => {
      const focusPart = request.userFocus
        ? `, con énfasis en temas relacionados a ${request.userFocus.toLowerCase()}`
        : "";

      if (
        request.profession?.toLowerCase().includes("frontend") &&
        request.experienceLevel?.toLowerCase().includes("junior")
      ) {
        return `Aprendizajes construyendo proyectos, React y JavaScript, errores comunes que he resuelto y mi crecimiento profesional${focusPart}.`;
      }

      return `Puedo hablar sobre aprendizajes, proyectos, buenas prácticas y crecimiento en ${
        request.profession?.toLowerCase() ?? "mi área profesional"
      }${focusPart}.`;
    },
  },
};

export async function getOnboardingHelp(
  request: OnboardingHelpRequest,
): Promise<OnboardingHelpResponse> {
  const content = helpContent[request.step] ?? {
    explanation:
      "No te preocupes si no tienes una respuesta perfecta. Solo necesitamos una idea general para empezar y luego podemos mejorarla.",
    examples: ["Describe tu objetivo con tus propias palabras", "Escribe una versión simple y luego la refinamos"],
    suggestion: () => "Quiero una respuesta simple y clara que refleje bien mi objetivo profesional.",
  };

  return {
    explanation: content.explanation,
    examples: content.examples,
    suggestion: content.suggestion(request),
  };
}

export function buildOnboardingHelpRequest(
  field: keyof UserProfile,
  profile: UserProfile,
  userFocus?: string,
): OnboardingHelpRequest {
  return {
    step: field,
    profession: profile.profession || undefined,
    experienceLevel: profile.yearsOfExperience
      ? `${profile.yearsOfExperience} años de experiencia`
      : undefined,
    careerGoal: profile.careerGoal || undefined,
    userFocus,
  };
}
