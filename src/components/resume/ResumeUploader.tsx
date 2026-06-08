import type { ChangeEvent } from "react";
import type { ResumeAsset } from "../../types";

interface ResumeUploaderProps {
  resume: ResumeAsset | null;
  onUpload: (resume: ResumeAsset) => void;
}

export default function ResumeUploader({ resume, onUpload }: ResumeUploaderProps) {
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    onUpload({
      fileName: file.name,
      uploadedAt: new Date().toISOString().slice(0, 10),
      extractedText: `Texto extraído de ${file.name}. En producción este contenido debe venir desde Supabase Storage y un extractor de PDF/DOCX.`,
    });
  }

  return (
    <section className="surface p-6">
      <div className="mb-5">
        <h3 className="text-xl font-bold text-slate-950">Upload de CV</h3>
        <p className="mt-2 text-sm text-slate-600">
          MVP listo para conectar con Supabase Storage y extracción automática de texto.
        </p>
      </div>

      <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-amber-300 bg-amber-50/60 px-6 text-center">
        <span className="text-base font-semibold text-slate-800">Sube tu CV en PDF o DOCX</span>
        <span className="mt-2 text-sm text-slate-600">Haz clic para seleccionar un archivo</span>
        <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
      </label>

      {resume && (
        <div className="mt-5 rounded-3xl bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-800">{resume.fileName}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-amber-700">Subido el {resume.uploadedAt}</p>
          <p className="mt-4 text-sm leading-7 text-slate-600">{resume.extractedText}</p>
        </div>
      )}
    </section>
  );
}
