import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useAuth } from "../contexts/AuthContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("maria@careercopilot.io");
  const [password, setPassword] = useState("demo12345");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "signin") {
        await signIn(email, password);
        navigate("/app");
      } else {
        const result = await signUp(email, password);

        if (result.requiresEmailConfirmation) {
          setSuccess("Tu cuenta fue creada. Revisa tu email para confirmar la cuenta antes de iniciar sesión.");
          setMode("signin");
          return;
        }

        navigate("/app");
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto mb-6 flex max-w-6xl justify-end">
        <ThemeToggle />
      </div>
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="surface p-8 md:p-10">
          <p className="eyebrow">Acceso</p>
          <h1 className="mt-4 font-display text-4xl md:text-5xl" style={{ color: "var(--text-primary)" }}>
            Entra y convierte tu experiencia en oportunidades visibles.
          </h1>
          <p className="mt-4 text-base leading-7 text-muted">
            Usa email y contraseña con Supabase Auth. Si aún no configuraste variables, la app funciona en modo local para acelerar validación.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {[
              "Posts, ideas y hooks basados en tu perfil.",
              "Skill gap analysis y competitiveness score.",
              "Roadmap de upskilling con prioridades claras.",
            ].map((item) => (
              <div key={item} className="soft-card px-5 py-4 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {item}
              </div>
            ))}
          </div>
          <Link className="mt-8 inline-flex text-sm font-semibold text-muted" to="/">
            Volver a la landing
          </Link>
        </div>

        <form className="surface p-8 md:p-10" onSubmit={handleSubmit}>
          <div className="flex rounded-full p-1" style={{ background: "color-mix(in srgb, var(--panel-muted) 72%, transparent)" }}>
            <button
              type="button"
              className="flex-1 rounded-full px-4 py-3 text-sm font-semibold transition"
              style={
                mode === "signin"
                  ? { background: "var(--panel-strong)", color: "var(--text-primary)" }
                  : { color: "var(--text-tertiary)" }
              }
              onClick={() => setMode("signin")}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              className="flex-1 rounded-full px-4 py-3 text-sm font-semibold transition"
              style={
                mode === "signup"
                  ? { background: "var(--panel-strong)", color: "var(--text-primary)" }
                  : { color: "var(--text-tertiary)" }
              }
              onClick={() => setMode("signup")}
            >
              Crear cuenta
            </button>
          </div>

          <div className="mt-8 space-y-5">
            <label>
              <span className="label">Email</span>
              <input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label>
              <span className="label">Contraseña</span>
              <input className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
          </div>

          {error && (
            <p className="mt-4 rounded-2xl px-4 py-3 text-sm font-semibold" style={{ background: "rgba(190, 66, 66, 0.12)", color: "#d84f4f" }}>
              {error}
            </p>
          )}
          {success && (
            <p className="mt-4 rounded-2xl px-4 py-3 text-sm font-semibold" style={{ background: "rgba(45, 98, 81, 0.14)", color: "#2f8f72" }}>
              {success}
            </p>
          )}

          <button type="submit" className="btn-primary mt-8 w-full" disabled={loading}>
            {loading ? "Procesando..." : mode === "signin" ? "Entrar" : "Crear cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
}
