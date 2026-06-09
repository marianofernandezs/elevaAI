import type {
  ContentIdea,
  DashboardState,
  GeneratedPost,
  ProfileAnalysis,
  RoadmapItem,
  SkillAssessment,
  UserProfile,
} from "../types";

export const emptyProfile: UserProfile = {
  fullName: "",
  profession: "",
  industry: "",
  country: "",
  yearsOfExperience: "",
  targetAudience: "",
  careerGoal: "",
  personalBrandGoal: "",
  communicationStyle: "",
  contentTopics: "",
  linkedInUrl: "",
};

export const sampleProfile: UserProfile = {
  fullName: "María Fernanda Soto",
  profession: "Product Marketing Manager",
  industry: "SaaS B2B",
  country: "Chile",
  yearsOfExperience: "6",
  targetAudience: "Founders, PMMs y equipos de revenue",
  careerGoal: "Posicionarme como referente en GTM y estrategia de producto",
  personalBrandGoal: "Publicar contenido consistente que atraiga oportunidades de consultoría",
  communicationStyle: "Cercano, estratégico y accionable",
  contentTopics: "go-to-market, pricing, launches, product storytelling",
  linkedInUrl: "https://linkedin.com/in/mariafernandasoto",
};

export const samplePosts: GeneratedPost[] = [
  {
    id: "post-1",
    title: "El error más caro en un lanzamiento B2B",
    hook: "El problema no era el producto. Era el mensaje.",
    content:
      "Después de entrevistar a 12 clientes, descubrimos que nadie entendía por qué nuestro producto importaba. Ajustamos la narrativa, simplificamos la propuesta de valor y el pipeline repuntó en tres semanas.",
    hashtags: ["#ProductMarketing", "#LinkedInTips", "#SaaS"],
    status: "draft",
    type: "Storytelling",
    goal: "Aumentar autoridad",
    createdAt: "2026-06-08",
  },
  {
    id: "post-2",
    title: "Qué medir antes de invertir más en adquisición",
    hook: "Más presupuesto no siempre arregla un funnel roto.",
    content:
      "Antes de escalar inversión, revisa claridad del mensaje, activación inicial y tiempo al primer valor. Si esas bases no están sólidas, el CAC solo se vuelve más caro.",
    hashtags: ["#Growth", "#B2BMarketing", "#CareerGrowth"],
    status: "published",
    type: "Consejo práctico",
    goal: "Generar oportunidades",
    createdAt: "2026-06-05",
  },
];

export const sampleIdeas: ContentIdea[] = [
  {
    id: "idea-1",
    title: "3 aprendizajes de tu último lanzamiento",
    angle: "Aprendizaje",
    description: "Convierte una experiencia reciente en lecciones accionables para otros profesionales.",
    pillar: "Autoridad",
  },
  {
    id: "idea-2",
    title: "Qué harías distinto si volvieras a empezar",
    angle: "Storytelling",
    description: "Una reflexión honesta sobre decisiones, errores y mejora profesional.",
    pillar: "Marca personal",
  },
  {
    id: "idea-3",
    title: "Skills que hoy diferencian a un PMM senior",
    angle: "Tendencia",
    description: "Usa el análisis de skills para abrir conversación con recruiters y peers.",
    pillar: "Empleabilidad",
  },
];

export const sampleAssessment: SkillAssessment = {
  competitivenessScore: 82,
  currentSkills: ["Go-to-market", "Storytelling", "Research", "Positioning"],
  missingSkills: ["Revenue analytics", "AI workflows", "Thought leadership system"],
  emergingSkills: ["Prompt design", "Audience intelligence", "Creator-led growth"],
  strengths: ["Claridad estratégica", "Narrativa profesional", "Experiencia real en lanzamientos"],
  weaknesses: ["Menor frecuencia de publicación", "Poca evidencia pública de resultados cuantitativos"],
};

export const sampleProfileAnalysis: ProfileAnalysis = {
  professionalSummary:
    "Profesional de marketing B2B con experiencia real en lanzamientos, posicionamiento y narrativa orientada a negocio.",
  niche: "Go-to-market y storytelling para SaaS B2B",
  industryContext:
    "Mercado competitivo donde la claridad estratégica, la conexión con revenue y la visibilidad pública generan diferenciación.",
  careerGoalSummary:
    "Posicionarse como referente en estrategia de producto y GTM para atraer oportunidades senior y consultoría.",
  linkedInOpportunities: [
    "Convertir aprendizajes de lanzamientos en contenido de autoridad.",
    "Publicar más evidencia cuantitativa para reforzar credibilidad.",
    "Conectar marketing con impacto de negocio en cada pieza de contenido.",
  ],
  prioritySkills: ["Thought leadership system", "Revenue analytics", "AI workflows"],
  initialRecommendation:
    "Tu mejor palanca inicial es convertir experiencia operativa en contenido consistente con enfoque en resultados y claridad de posicionamiento.",
  positioningStatement:
    "Ayudo a equipos SaaS B2B a traducir estrategia de producto en narrativas que aceleran adopción, revenue y posicionamiento.",
  topOpportunities: [
    "Autoridad en go-to-market para productos B2B.",
    "Narrativa pública más consistente y reconocible.",
    "Mayor alineación entre contenido y oportunidades de consultoría.",
  ],
  recommendedActions: [
    "Crear tu primer post de autoridad sobre un lanzamiento real.",
    "Subir CV para enriquecer contexto y detectar skill gaps.",
    "Definir una cadencia de contenido conectada con revenue y posicionamiento.",
  ],
};

export const sampleRoadmap: RoadmapItem[] = [
  {
    horizon: "30 días",
    skill: "Thought leadership system",
    priority: "Alta",
    reason: "Necesitas consistencia para convertir expertise en visibilidad.",
    expectedImpact: "Más alcance y recordación profesional.",
  },
  {
    horizon: "90 días",
    skill: "Revenue analytics",
    priority: "Alta",
    reason: "Te ayuda a conectar marketing con impacto de negocio.",
    expectedImpact: "Mejor posicionamiento frente a roles senior y consultoría.",
  },
  {
    horizon: "6 meses",
    skill: "AI workflows",
    priority: "Media",
    reason: "Escala tu producción de contenido y tu capacidad de análisis.",
    expectedImpact: "Mayor productividad y diferenciación en el mercado.",
  },
];

export const initialDashboardState: DashboardState = {
  profile: emptyProfile,
  profileAnalysis: null,
  posts: [],
  ideas: [],
  resume: null,
  assessment: {
    competitivenessScore: 0,
    currentSkills: [],
    missingSkills: [],
    emergingSkills: [],
    strengths: [],
    weaknesses: [],
  },
  roadmap: [],
};
