import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("maria@careercopilot.io");
  const [password, setPassword] = useState("demo12345");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }

      navigate("/app");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-grain px-4 py-10 md:px-6">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="surface p-8 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">Acceso</p>
          <h1 className="mt-4 font-display text-4xl text-slate-950">Entra y convierte tu experiencia en oportunidades visibles.</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Usa email y contraseña con Supabase Auth. Si aún no configuraste variables, la app funciona en modo local para acelerar validación.
          </p>
          <div className="mt-8 space-y-4">
            {[
              "Posts, ideas y hooks basados en tu perfil.",
              "Skill gap analysis y competitiveness score.",
              "Roadmap de upskilling con prioridades claras.",
            ].map((item) => (
              <div key={item} className="rounded-3xl bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-700">
                {item}
              </div>
            ))}
          </div>
          <Link className="mt-8 inline-flex text-sm font-semibold text-slate-700" to="/">
            Volver a la landing
          </Link>
        </div>

        <form className="surface p-8 md:p-10" onSubmit={handleSubmit}>
          <div className="flex rounded-full bg-slate-100 p-1">
            <button
              type="button"
              className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold ${mode === "signin" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}
              onClick={() => setMode("signin")}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold ${mode === "signup" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}
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

          {error && <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}

          <button type="submit" className="btn-primary mt-8 w-full" disabled={loading}>
            {loading ? "Procesando..." : mode === "signin" ? "Entrar" : "Crear cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
}
