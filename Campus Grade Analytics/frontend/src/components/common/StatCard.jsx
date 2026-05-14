export default function StatCard({ label, value, helper }) {
  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900/80">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
      {helper ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{helper}</p> : null}
    </div>
  );
}

