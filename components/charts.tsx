"use client";
import { Wallet, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { chartData } from "@/lib/data";
export function Stat({
  title,
  value,
  change,
  icon: Icon = Wallet,
}: {
  title: string;
  value: string;
  change: string;
  icon?: typeof Wallet;
}) {
  return (
    <div className="stat">
      <div className="stat-top">
        <span>{title}</span>
        <span className="stat-icon">
          <Icon size={18} />
        </span>
      </div>
      <strong>{value}</strong>
      <div className="stat-bottom">
        <span>
          <TrendingUp size={13} /> {change}
        </span>
        <small>vs. last month</small>
      </div>
    </div>
  );
}
export function Chart({
  title,
  subtitle,
  kind = "area",
}: {
  title: string;
  subtitle: string;
  kind?: string;
}) {
  return (
    <section className="card chart-card">
      <div className="card-heading">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <span className="legend">
          <i /> {kind === "bar" ? "Collections" : "This week"}
        </span>
      </div>
      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          {kind === "pie" ? (
            <PieChart>
              <Pie
                data={[
                  { name: "Approved", value: 68 },
                  { name: "Pending", value: 23 },
                  { name: "Rejected", value: 9 },
                ]}
                dataKey="value"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={4}
              >
                {["#087443", "#f5bb4a", "#ec7777"].map((c) => (
                  <Cell key={c} fill={c} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          ) : kind === "bar" ? (
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#edf1ef"
              />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar
                dataKey="collections"
                fill="#10b981"
                radius={[5, 5, 0, 0]}
                barSize={24}
              />
              <Bar
                dataKey="registrations"
                fill="#d7eee4"
                radius={[5, 5, 0, 0]}
                barSize={24}
              />
            </BarChart>
          ) : (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id={`green-${title.replaceAll(" ", "")}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#edf1ef"
              />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="registrations"
                stroke="#087443"
                strokeWidth={3}
                fill={`url(#green-${title.replaceAll(" ", "")})`}
              />
              <Area
                type="monotone"
                dataKey="collections"
                stroke="#93cdb1"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="transparent"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
      {kind === "pie" && (
        <div className="pie-legend">
          Approved 68% <span>Pending 23%</span> Rejected 9%
        </div>
      )}
    </section>
  );
}
