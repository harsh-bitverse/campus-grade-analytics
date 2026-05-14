import { Link } from "react-router-dom";
import SectionTitle from "../components/common/SectionTitle";
import { useCourses } from "../hooks/useCourses";

export default function CourseDashboardPage() {
  const { courses, loading, error } = useCourses();

  return (
    <div className="space-y-10">
      <SectionTitle
        eyebrow="Course Dashboard"
        title="Browse active courses"
        description="Each course card can lead to public analytics once submissions have been cleaned and analyzed."
      />

      {loading ? <p>Loading courses...</p> : null}
      {error ? <p className="text-red-500">{error}</p> : null}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm uppercase tracking-[0.25em] text-brand-600">{course.courseCode}</p>
            <h3 className="mt-3 text-xl font-semibold">{course.courseName}</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{course.semester}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{course.professor || "Professor not listed"}</p>
            <Link
              to={`/analytics/${course.id}`}
              className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white dark:bg-brand-500"
            >
              View Analytics
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

