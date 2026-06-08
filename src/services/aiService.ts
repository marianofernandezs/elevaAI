import { captureAppError } from "../lib/sentry";
import type { ContentIdea, GeneratedPost, RoadmapItem, SkillAssessment, UserProfile } from "../types";

type AIProvider = "openrouter" | "openai" | "anthropic" | "gemini";

interface GeneratePostInput {
  profile: UserProfile;
  baseIdea: string;
  goal: string;
  type: string;
  length: string;
}

interface RewriteContentInput {
  profile: UserProfile;
  sourceText: string;
}

interface HookInput {
  profile: UserProfile;
  topic: string;
}

interface SkillGapInput {
  profile: UserProfile;
  resumeText: string;
}

interface ProviderConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
}

function getProviderConfig(): ProviderConfig {
  const env = import.meta.env as Record<string, string | undefined>;
  const provider = (env.VITE_AI_PROVIDER as AIProvider | undefined) ?? "openrouter";
  const apiKey = env.OPENROUTER_API_KEY ?? "";
  const model = env.OPENROUTER_MODEL ?? "meta-llama/llama-3.1-8b-instruct";

  return { provider, apiKey, model };
}

async function tryRemoteGeneration(prompt: string) {
  const config = getProviderConfig();

  if (!config.apiKey || config.provider !== "openrouter") {
    return null;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: "system",
            content: "Responde en español con tono profesional, humano, claro y accionable.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter devolvió ${response.status}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    return data.choices?.[0]?.message?.content ?? null;
  } catch (error) {
    captureAppError(error, { scope: "ai:openrouter" });
    return null;
  }
}

export async function checkAIConnection() {
  const config = getProviderConfig();

  if (!config.apiKey || config.provider !== "openrouter") {
    return {
      available: false,
      message: "No hay proveedor remoto activo. La app usará fallback local.",
    };
  }

  const result = await tryRemoteGeneration("Responde solo con la palabra: conectado");
  if (!result) {
    return {
      available: false,
      message: "No pudimos validar OpenRouter. La UI seguirá usando fallback local.",
    };
  }

  return {
    available: true,
    message: "OpenRouter respondió correctamente.",
  };
}

function profileContext(profile: UserProfile) {
  return `Profesión: ${profile.profession}. Industria: ${profile.industry}. Experiencia: ${profile.yearsOfExperience} años. Objetivo profesional: ${profile.careerGoal}. Audiencia: ${profile.targetAudience}. País: ${profile.country}. Estilo: ${profile.communicationStyle}.`;
}

export async function generateLinkedInPost(input: GeneratePostInput): Promise<GeneratedPost> {
  const prompt = `Crea un post de LinkedIn en español.
${profileContext(input.profile)}
Idea base: ${input.baseIdea}
Objetivo: ${input.goal}
Tipo: ${input.type}
Longitud: ${input.length}

Devuelve: hook, cuerpo, CTA y 3 hashtags.`;

  const remoteResult = await tryRemoteGeneration(prompt);
  const content =
    remoteResult ??
    `${input.baseIdea}\n\nSi algo he aprendido en ${input.profile.yearsOfExperience} años es que la claridad estratégica importa más que la complejidad. Cuando conectas experiencia real con una perspectiva útil para tu audiencia, el contenido deja de sonar genérico y empieza a generar confianza.\n\nMi recomendación: convierte un reto reciente en una lección concreta, añade contexto y cierra con una invitación a conversar.\n\n¿Qué cambiarías tú en este enfoque?`;

  return {
    id: crypto.randomUUID(),
    title: input.baseIdea,
    hook: content.split("\n")[0] ?? input.baseIdea,
    content,
    hashtags: ["#LinkedIn", "#MarcaPersonal", "#CareerGrowth"],
    status: "draft",
    type: input.type,
    goal: input.goal,
    createdAt: new Date().toISOString().slice(0, 10),
  };
}

export async function generateHooks(input: HookInput): Promise<string[]> {
  const prompt = `Genera 10 hooks en español para LinkedIn sobre ${input.topic}. ${profileContext(input.profile)}`;
  const remoteResult = await tryRemoteGeneration(prompt);

  if (remoteResult) {
    return remoteResult
      .split("\n")
      .map((line) => line.replace(/^\d+[\).\s-]*/, "").trim())
      .filter(Boolean)
      .slice(0, 10);
  }

  return [
    "La mayoría intenta verse experta demasiado pronto.",
    "Lo que cambió mi carrera no fue otro curso.",
    "Una conversación me mostró la brecha que no estaba viendo.",
    "Si hoy volviera a empezar en LinkedIn, haría esto primero.",
    "No necesitas publicar más, necesitas publicar mejor.",
    "La habilidad más subestimada para crecer profesionalmente es esta.",
    "Detrás de cada perfil sólido hay una historia estratégica.",
    "No fue talento, fue repetición con foco.",
    "Esto aprendí al comparar mi perfil con lo que pide el mercado.",
    "La visibilidad profesional no llega por accidente.",
  ];
}

export async function rewriteContent(input: RewriteContentInput): Promise<string> {
  const prompt = `Reescribe estas notas en un post profesional para LinkedIn en español.\n${profileContext(input.profile)}\nNotas: ${input.sourceText}`;
  const remoteResult = await tryRemoteGeneration(prompt);

  return (
    remoteResult ??
    `Idea central: ${input.sourceText}\n\nTomé esta experiencia y la transformé en una lección práctica. Muchas veces creemos que necesitamos más credenciales para publicar, cuando en realidad lo que más conecta es la claridad, la honestidad y una reflexión útil para otros.\n\nSi estás construyendo tu marca personal, empieza por documentar lo que ya estás aprendiendo.`
  );
}

export async function generateIdeas(profile: UserProfile): Promise<ContentIdea[]> {
  const prompt = `Genera 6 ideas de contenido para LinkedIn en español para este perfil.\n${profileContext(profile)}`;
  const remoteResult = await tryRemoteGeneration(prompt);

  if (remoteResult) {
    return remoteResult
      .split("\n")
      .filter(Boolean)
      .slice(0, 6)
      .map((line, index) => ({
        id: `ai-idea-${index}`,
        title: line.replace(/^\d+[\).\s-]*/, "").trim(),
        angle: "Autoridad",
        description: "Idea generada con IA a partir de tu perfil profesional.",
        pillar: "Contenido",
      }));
  }

  return [
    {
      id: crypto.randomUUID(),
      title: "Qué aprendiste al resolver un problema complejo en tu rol",
      angle: "Experiencia",
      description: "Convierte un desafío real en una narrativa útil y memorable.",
      pillar: "Autoridad",
    },
    {
      id: crypto.randomUUID(),
      title: "Skills que hoy más te están pidiendo recruiters y clientes",
      angle: "Mercado",
      description: "Une empleabilidad con una lectura práctica de tendencias.",
      pillar: "Career Growth",
    },
    {
      id: crypto.randomUUID(),
      title: "Una opinión poco popular sobre tu industria",
      angle: "Opinión",
      description: "Posiciona criterio propio con argumentos y experiencia.",
      pillar: "Marca personal",
    },
  ];
}

export async function analyzeSkillGap(input: SkillGapInput): Promise<SkillAssessment> {
  const prompt = `Analiza skill gap y empleabilidad en español.\n${profileContext(input.profile)}\nCV: ${input.resumeText}`;
  const remoteResult = await tryRemoteGeneration(prompt);

  if (remoteResult) {
    const parsedLines = remoteResult.split("\n").filter(Boolean);
    return {
      competitivenessScore: 80,
      currentSkills: parsedLines.slice(0, 4),
      missingSkills: ["Visibilidad consistente", "Pensamiento analítico", "AI workflows"],
      emergingSkills: ["Creator economy", "Audience intelligence"],
      strengths: ["Experiencia relevante", "Perfil claro"],
      weaknesses: ["Poca evidencia pública", "Menor cadencia de publicación"],
    };
  }

  return {
    competitivenessScore: 79,
    currentSkills: ["Comunicación", "Experiencia funcional", "Ejecución", "Conocimiento de industria"],
    missingSkills: ["Prueba social visible", "Contenido de autoridad", "Automatización con IA"],
    emergingSkills: ["AI copilots", "Personal knowledge systems", "Distribution strategy"],
    strengths: ["Base profesional sólida", "Objetivo bien definido", "Experiencias reutilizables para contenido"],
    weaknesses: ["Perfil todavía subcomunica logros", "Falta una narrativa pública repetible"],
  };
}

export async function generateRoadmap(assessment: SkillAssessment): Promise<RoadmapItem[]> {
  return [
    {
      horizon: "30 días",
      skill: assessment.missingSkills[0] ?? "Contenido de autoridad",
      priority: "Alta",
      reason: "Es la brecha con mayor impacto inmediato en empleabilidad y visibilidad.",
      expectedImpact: "Más claridad de posicionamiento y mejor percepción de expertise.",
    },
    {
      horizon: "90 días",
      skill: assessment.missingSkills[1] ?? "Análisis de mercado",
      priority: "Alta",
      reason: "Te permite conectar tu perfil con necesidades reales del mercado.",
      expectedImpact: "Mayor relevancia para recruiters y clientes potenciales.",
    },
    {
      horizon: "6 meses",
      skill: assessment.missingSkills[2] ?? "AI workflows",
      priority: "Media",
      reason: "Escala tu producción y te diferencia como profesional actualizado.",
      expectedImpact: "Más productividad y capacidad de experimentar con nuevos formatos.",
    },
  ];
}
