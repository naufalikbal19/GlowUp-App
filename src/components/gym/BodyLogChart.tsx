"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card } from "@/components/ui";

export interface BodyLogPoint {
  date: string;
  weightKg: number;
  bodyFatPct: number | null;
}

export function BodyLogChart({ data }: { data: BodyLogPoint[] }) {
  if (data.length < 2) return null;

  return (
    <Card>
      <h2 className="mb-3 font-semibold">Tren Berat Badan & Fat Rate</h2>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-black/10 dark:stroke-white/10" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis yAxisId="left" fontSize={12} />
            <YAxis yAxisId="right" orientation="right" fontSize={12} />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="weightKg" name="Berat (kg)" stroke="#2563eb" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="bodyFatPct" name="Fat Rate (%)" stroke="#db2777" strokeWidth={2} dot={false} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
