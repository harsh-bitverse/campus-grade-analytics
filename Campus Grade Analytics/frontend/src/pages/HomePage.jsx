import { Link } from "react-router-dom";
import { Database, ShieldCheck, Sparkles } from "lucide-react";
import SectionTitle from "../components/common/SectionTitle";

const features = [
  {
    icon: Sparkles,
    title: "Crowdsourced estimates",
    description: "Students anonymously submit marks and grades so the platform can estimate likely relative grading cutoffs."
  },
  {
    icon: Database,
    title: "Statistically cleaned data",
    description: "A Python pipeline removes invalid rows, flags conflicts, and estimates each grade boundary with confidence."
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    description: "Anonymous submissions stay anonymous publicly, while admins can still moderate suspicious entries safely."
  }
];

export default function HomePage() {
  return (
    <div className="space-y-20">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <p className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 dark:border-brand-900 dark:bg-brand-950/60 dark:text-brand-200">
            Built for students. Structured for scale.
          </p>
          <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Understand relative grading with cleaner, smarter, and transparent course analytics.
          </h1>
          <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Campus Grade Analytics helps students estimate grade cutoffs using shared mark data, while a cleaning engine filters suspicious records and measures confidence.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/courses" className="rounded-full bg-slate-900 px-6 py-3 font-medium text-white dark:bg-brand-500">
              Explore Courses
            </Link>
            <Link to="/submit" className="rounded-full border border-slate-300 px-6 py-3 font-medium dark:border-slate-700">
              Submit Marks
            </Link>
          </div>
        </div>

        <div className="animate-float rounded-[2rem] border border-slate-200/70 bg-white/90 p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900/85">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Responses</p>
              <p className="mt-2 text-3xl font-bold">1,284</p>
            </div>
            <div className="rounded-2xl bg-brand-50 p-5 dark:bg-brand-950/60">
              <p className="text-sm text-slate-500 dark:text-slate-300">Avg confidence</p>
              <p className="mt-2 text-3xl font-bold">91%</p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Flagged rows</p>
              <p className="mt-2 text-3xl font-bold">37</p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Live courses</p>
              <p className="mt-2 text-3xl font-bold">42</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <SectionTitle
          eyebrow="Why This Matters"
          title="A learner-friendly full stack foundation"
          description="The project is structured so you can trace each feature across UI, API, database, and analytics scripts without jumping through complicated abstractions."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article key={feature.title} className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/85">
                <div className="mb-4 inline-flex rounded-2xl bg-brand-100 p-3 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  <Icon />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-slate-600 dark:text-slate-300">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

