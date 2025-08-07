"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface YieldDataPoint {
  date: string; // formatted date
  total: number;
}

export default function YieldChart({ data }: { data: YieldDataPoint[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-gray-500">No yield data yet.</p>;
  }
  return (
    <div className="h-72 w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold text-gray-700">Yield Over Time (kg)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} domain={[0, "auto"]} />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#16A34A" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

