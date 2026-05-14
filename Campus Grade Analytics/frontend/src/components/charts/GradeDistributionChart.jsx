import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const colors = ["#1ca892", "#0ea5e9", "#f59e0b", "#f97316", "#ef4444", "#8b5cf6", "#64748b"];

export default function GradeDistributionChart({ data }) {
  return (
    <div className="h-80 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-lg font-semibold">Grade Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="grade" innerRadius={60} outerRadius={100}>
            {data.map((entry, index) => (
              <Cell key={entry.grade} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

