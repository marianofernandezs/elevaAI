import type { ChangeEvent } from "react";
import type { ResumeAsset } from "../../types";

interface ResumeUploaderProps {
  resume: ResumeAsset | null;
  onUpload: (file: File) => Promise<void>;
  hideHeader?: boolean;
}

export default function ResumeUploader({ resume, onUpload, hideHeader = false }: ResumeUploaderProps) {
  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    await onUpload(file);
  }

  return (
    <section className="surface min-w-0 p-6">
      {!hideHeader && (
        <div className="mb-5">
          <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Upload de CV</h3>
          <p className="mt-2 text-sm text-muted">
            MVP listo para conectar con Supabase Storage y extracción automática de texto.
          </p>
        </div>
      )}

      <label
        className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border border-dashed px-6 text-center transition hover:-translate-y-0.5"
        style={{ borderColor: "color-mix(in srgb, var(--accent) 38%, transparent)", background: "var(--accent-soft)" }}
      >
        <span className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Sube tu CV en PDF o DOCX</span>
        <span className="mt-2 text-sm text-muted">Haz clic para seleccionar un archivo</span>
        <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
      </label>

      {resume && (
        <div className="soft-card mt-5 min-w-0 p-5 break-words">
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{resume.fileName}</p>
          <p className="eyebrow mt-1">Subido el {resume.uploadedAt}</p>
          {resume.publicUrl && (
            <a
              className="mt-3 inline-flex text-sm font-semibold"
              style={{ color: "var(--accent)" }}
              href={resume.publicUrl}
              target="_blank"
              rel="noreferrer"
            >
              Abrir archivo en Storage
            </a>
          )}
          <p className="mt-4 text-sm leading-7 text-muted">{resume.extractedText}</p>
        </div>
      )}
    </section>
  );
}
