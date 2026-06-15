import type { ReactNode } from "react";

/**
 * A lightweight utility to parse simple bold (**text**) and italic (*text*) markdown tokens
 * and render them as React elements.
 */
export function renderMarkdown(text: string): ReactNode {
  if (!text) return "";

  // Regex to match **bold** or *italic* on a single line
  const regex = /(\*\*[^\n*]+\*\*|\*[^\n*]+\*)/g;
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={index}>{part.slice(1, -1)}</em>;
        }
        return part;
      })}
    </>
  );
}
