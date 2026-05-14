import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { submissionService } from "../services/submissionService";
import { useCourses } from "../hooks/useCourses";
import SectionTitle from "../components/common/SectionTitle";

const initialForm = {
  courseId: "",
  totalMarks: "",
  obtainedGrade: "",
  isAnonymous: true
};

export default function SubmitMarksPage() {
  const { user } = useAuth();
  const { courses } = useCourses();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = {
        ...form,
        totalMarks: Number(form.totalMarks)
      };

      if (user && !form.isAnonymous) {
        await submissionService.submitAuthenticated(payload);
      } else {
        await submissionService.submitAnonymous(payload);
      }

      setMessage("Submission saved successfully.");
      setForm(initialForm);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not submit marks");
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-4">
        <SectionTitle
          eyebrow="Student Input"
          title="Submit marks anonymously or with your account"
          description="The backend stores your original grade, maps it to an internal numeric value, and rejects grades below D."
        />
        <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Allowed grades: <span className="font-semibold">A, A-, B, B-, C, C-, D</span>
          </p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Invalid grades like E or F are rejected before they ever reach the analytics engine.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] border border-slate-200/70 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div>
          <label className="mb-2 block text-sm font-medium">Course</label>
          <select
            className="w-full rounded-2xl border border-slate-300 bg-slate-900 text-white px-4 py-3 outline-none dark:border-slate-700"            value={form.courseId}
            onChange={(event) => setForm((current) => ({ ...current, courseId: event.target.value }))}
            required
          >
            <option value="" className="bg-slate-900 text-white">
                Select a course
            </option>
            {courses.map((course) => (
              <option
                key={course.id}
                value={course.id}
                className="bg-slate-900 text-white"
              >
                {course.courseCode} - {course.courseName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Total Marks</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            className="w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 outline-none dark:border-slate-700"
            value={form.totalMarks}
            onChange={(event) => setForm((current) => ({ ...current, totalMarks: event.target.value }))}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Obtained Grade</label>
          <input
            type="text"
            className="w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 uppercase outline-none dark:border-slate-700"
            value={form.obtainedGrade}
            onChange={(event) => setForm((current) => ({ ...current, obtainedGrade: event.target.value }))}
            placeholder="Example: A-"
            required
          />
        </div>

        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={form.isAnonymous}
            onChange={(event) => setForm((current) => ({ ...current, isAnonymous: event.target.checked }))}
          />
          Keep this submission anonymous
        </label>

        {message ? <p className="text-sm text-emerald-500">{message}</p> : null}
        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <button type="submit" className="rounded-full bg-slate-900 px-6 py-3 font-medium text-white dark:bg-brand-500">
          Submit Marks
        </button>
      </form>
    </div>
  );
}

