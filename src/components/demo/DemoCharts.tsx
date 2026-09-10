"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { DEMO_FUNNEL, DEMO_REVENUE } from "@/lib/demo-data";

// Графики демо-дашборда.

export function RevenueChart({ data, metric }: { data: typeof DEMO_REVENUE; metric: "revenue" | "deals" }) {
  const key = metric;
  const label = metric === "revenue" ? "Выручка" : "Сделок";
  const color = metric === "revenue" ? "#3b82f6" : "#0ea5e9";

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => (metric === "revenue" ? `${v}М` : String(v))}
        />
        <Tooltip
          formatter={(value) => [
            metric === "revenue" ? `${value} млн BYN` : `${value} сделок`,
            label,
          ]}
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            fontSize: 12,
          }}
        />
        <Area
          type="monotone"
          dataKey={key}
          stroke={color}
          strokeWidth={2.5}
          fill="url(#revGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function FunnelChart({ onSelect }: { onSelect?: (stage: string) => void }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={DEMO_FUNNEL}
        layout="vertical"
        margin={{ top: 0, right: 12, left: 8, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="stage"
          width={110}
          tick={{ fontSize: 11, fill: "#64748b" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value) => [`${value} сделок`, "Количество"]}
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            fontSize: 12,
          }}
        />
        <Bar
          dataKey="count"
          radius={[0, 6, 6, 0]}
          barSize={22}
          cursor="pointer"
          onClick={(data) => {
            const stage = (data as unknown as { stage?: string })?.stage;
            if (stage && onSelect) onSelect(stage);
          }}
        >
          {DEMO_FUNNEL.map((stage) => (
            <Cell key={stage.stage} fill={stage.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
