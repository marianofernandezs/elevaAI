async function extractFromPdf(file: File) {
  const pdfjsLib = await import("pdfjs-dist");
  const pdfWorker = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pages = await Promise.all(
    Array.from({ length: pdf.numPages }, async (_unused, index) => {
      const page = await pdf.getPage(index + 1);
      const content = await page.getTextContent();
      return content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ");
    }),
  );

  return pages.join("\n");
}

async function extractFromDocx(file: File) {
  const mammoth = await import("mammoth");
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value;
}

export async function extractResumeText(file: File) {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".pdf")) {
    return extractFromPdf(file);
  }

  if (fileName.endsWith(".docx")) {
    return extractFromDocx(file);
  }

  throw new Error("Solo se soportan CVs en PDF y DOCX.");
}
