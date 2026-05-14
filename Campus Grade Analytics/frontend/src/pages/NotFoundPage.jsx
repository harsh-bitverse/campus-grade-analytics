import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl text-center">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">The route you tried to open does not exist in this project yet.</p>
      <Link to="/" className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-white dark:bg-brand-500">
        Back home
      </Link>
    </div>
  );
}

