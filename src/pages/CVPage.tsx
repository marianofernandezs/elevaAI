import AppShell from "../components/layout/AppShell";
import ResumeUploader from "../components/resume/ResumeUploader";
import { useAuth } from "../contexts/AuthContext";
import { useWorkspaceData } from "../hooks/useWorkspaceData";

export default function CVPage() {
  const { signOut, userEmail } = useAuth();
  const { state, isLoading, uploadResumeFile, banner } = useWorkspaceData();

  return (
    <AppShell email={userEmail} onSignOut={signOut}>
      <div className="space-y-6">
        <div className="surface min-w-0 overflow-hidden">
          <div className="grid min-w-0 gap-5 p-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-center">
            <div>
              <p className="eyebrow">CV Analysis</p>
              <h1 className="mt-3 text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
                Analizar CV
              </h1>
              <p className="mt-2 text-sm text-muted">
                Sube o actualiza tu CV para convertirlo en contexto reusable dentro del agente.
              </p>
            </div>
            {banner && (
              <div className="soft-card min-w-0 p-5 text-sm leading-7 text-muted break-words">
                {banner}
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="surface p-6 text-sm font-semibold text-muted">
            Cargando CV...
          </div>
        ) : (
          <ResumeUploader resume={state.resume} onUpload={uploadResumeFile} hideHeader={true} />
        )}
      </div>
    </AppShell>
  );
}
