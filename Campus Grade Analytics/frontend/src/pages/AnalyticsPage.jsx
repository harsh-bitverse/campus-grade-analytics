import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SectionTitle from "../components/common/SectionTitle";
import StatCard from "../components/common/StatCard";
import MarksHistogram from "../components/charts/MarksHistogram";
import GradeDistributionChart from "../components/charts/GradeDistributionChart";
import CutoffCurveChart from "../components/charts/CutoffCurveChart";
import { analyticsService } from "../services/analyticsService";

export default function AnalyticsPage() {
  const { courseId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const response = await analyticsService.getCourseAnalytics(courseId);
        setAnalytics(response.data.analytics);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Analytics are not ready yet");
      }
    }

    loadAnalytics();
  }, [courseId]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!analytics) {
    return <p>Loading analytics...</p>;
  }

  return (
    <div className="space-y-10">
      <SectionTitle
        eyebrow={analytics.course.courseCode}
        title={analytics.course.courseName}
        description={`${analytics.course.semester}${analytics.course.professor ? ` • ${analytics.course.professor}` : ""}`}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total responses" value={analytics.metrics.totalResponses} />
        <StatCard label="Open flags" value={analytics.metrics.flaggedResponses} />
        <StatCard
          label="Top cutoff confidence"
          value={`${Math.round(analytics.estimatedCutoffs[0]?.confidenceScore || 0)}%`}
          helper="Highest grade band confidence"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <MarksHistogram data={analytics.markHistogram} />
        <GradeDistributionChart data={analytics.gradeDistribution} />
      </div>

      <CutoffCurveChart data={analytics.estimatedCutoffs} />

      <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead>
            <tr className="text-left text-sm text-slate-500 dark:text-slate-400">
              <th className="px-6 py-4">Grade</th>
              <th className="px-6 py-4">Estimated lowest mark</th>
              <th className="px-6 py-4">Highest mark below it</th>
              <th className="px-6 py-4">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {analytics.estimatedCutoffs.map((cutoff) => (
              <tr key={cutoff.id} className="text-sm">
                <td className="px-6 py-4 font-medium">{cutoff.gradeLabel}</td>
                <td className="px-6 py-4">{cutoff.estimatedLowerMark.toFixed(2)}</td>
                <td className="px-6 py-4">{cutoff.highestBelowMark?.toFixed(2) ?? "N/A"}</td>
                <td className="px-6 py-4">{Math.round(cutoff.confidenceScore)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

