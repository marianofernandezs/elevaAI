import { Navigate, useNavigate } from "react-router-dom";
import ProfileForm from "../components/profile/ProfileForm";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useAuth } from "../contexts/AuthContext";
import { useWorkspaceData } from "../hooks/useWorkspaceData";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { state, isLoading, profileComplete, saveProfile } = useWorkspaceData();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!isLoading && profileComplete) {
    return <Navigate to="/workspace" replace />;
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto mb-6 flex max-w-5xl justify-end">
        <ThemeToggle />
      </div>
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="surface p-8 md:p-10">
          <p className="eyebrow">Onboarding</p>
          <h1 className="mt-4 font-display text-4xl md:text-5xl" style={{ color: "var(--text-primary)" }}>
            Antes de entrar al workspace, necesitamos tu perfil profesional.
          </h1>
          <p className="mt-4 text-base leading-7 text-muted">
            Este contexto alimenta tus prompts, recomendaciones y análisis. Cuando termines, entrarás directo al lienzo principal con tu agente lateral.
          </p>
          <div className="mt-8 space-y-4">
            {[
              "El agente usará tu profesión, industria y objetivo como contexto base.",
              "Tus análisis de CV, skill gap y roadmap serán más relevantes.",
              "Luego podrás editar el perfil desde el workspace o desde /profile.",
            ].map((item) => (
              <div key={item} className="soft-card px-5 py-4 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="surface p-2 md:p-3">
          <ProfileForm
            profile={state.profile}
            onChange={async (profile) => {
              await saveProfile(profile);
              navigate("/workspace");
            }}
          />
        </section>
      </div>
    </div>
  );
}
