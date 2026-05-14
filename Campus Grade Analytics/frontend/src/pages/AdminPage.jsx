import { useEffect, useState } from "react";
import SectionTitle from "../components/common/SectionTitle";
import { analyticsService } from "../services/analyticsService";
import { courseService } from "../services/courseService";

const initialCourse = {
  courseCode: "",
  courseName: "",
  semester: "",
  professor: ""
};

export default function AdminPage() {
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [form, setForm] = useState(initialCourse);
  const [message, setMessage] = useState("");

  async function loadAdminData() {
    const [coursesResponse, submissionsResponse] = await Promise.all([
      courseService.list(),
      analyticsService.listSubmissions()
    ]);

    setCourses(coursesResponse.data.courses);
    setSubmissions(submissionsResponse.data.submissions);
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  async function handleCreateCourse(event) {
    event.preventDefault();
    await courseService.create(form);
    setForm(initialCourse);
    setMessage("Course created.");
    await loadAdminData();
  }

  async function handleRunCleaning(courseId) {
    await analyticsService.runCleaning(courseId);
    setMessage("Cleaning engine completed.");
    await loadAdminData();
  }

  async function handleExportCsv() {
    const response = await analyticsService.exportCsv();
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", "submissions.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  }

  return (
    <div className="space-y-10">
      <SectionTitle
        eyebrow="Admin"
        title="Moderation and course management"
        description="Admins can create courses, launch the cleaning engine, inspect suspicious records, and export the current dataset."
      />

      {message ? <p className="text-sm text-emerald-500">{message}</p> : null}

      <div className="grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={handleCreateCourse} className="space-y-4 rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-semibold">Create course</h3>
          {Object.keys(form).map((key) => (
            <input
              key={key}
              type="text"
              placeholder={key}
              className="w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 outline-none capitalize dark:border-slate-700"
              value={form[key]}
              onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
            />
          ))}
          <button type="submit" className="rounded-full bg-slate-900 px-5 py-3 text-white dark:bg-brand-500">
            Save course
          </button>
        </form>

        <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-semibold">Courses</h3>
            <button type="button" onClick={handleExportCsv} className="text-sm font-medium text-brand-600">
              Export CSV
            </button>
          </div>

          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold">{course.courseCode} - {course.courseName}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{course.semester}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRunCleaning(course.id)}
                  className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white"
                >
                  Run Cleaning
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead>
            <tr className="text-left text-sm text-slate-500 dark:text-slate-400">
              <th className="px-6 py-4">Course</th>
              <th className="px-6 py-4">Marks</th>
              <th className="px-6 py-4">Grade</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Suspicious</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id} className="text-sm">
                <td className="px-6 py-4">{submission.course.courseCode}</td>
                <td className="px-6 py-4">{submission.totalMarks}</td>
                <td className="px-6 py-4">{submission.originalGrade}</td>
                <td className="px-6 py-4">{submission.status}</td>
                <td className="px-6 py-4">{submission.cleanedRecord?.isSuspicious ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
