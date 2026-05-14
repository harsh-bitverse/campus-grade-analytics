import { LineChart, Line, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function CutoffCurveChart({ data }) {
  return (
    <div className="h-80 rounded-3xl border border-slate-200/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-lg font-semibold">Estimated Cutoff Curve</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="gradeLabel" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="estimatedLowerMark" stroke="#1ca892" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

