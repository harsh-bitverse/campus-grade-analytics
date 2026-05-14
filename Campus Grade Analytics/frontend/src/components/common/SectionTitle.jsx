export default function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">{eyebrow}</p>
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
      {description ? <p className="max-w-2xl text-slate-600 dark:text-slate-300">{description}</p> : null}
    </div>
  );
}

