interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export default function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">{eyebrow}</p>
      <h2 className="font-display text-3xl text-slate-950 md:text-4xl">{title}</h2>
      <p className="max-w-2xl text-base leading-7 text-slate-600">{description}</p>
    </div>
  );
}
