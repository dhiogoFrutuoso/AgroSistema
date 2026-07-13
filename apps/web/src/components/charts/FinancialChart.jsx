import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { financialSummary } from "../../data/mockFinancial.js";

export default function FinancialChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={financialSummary}>
          <defs>
            <linearGradient id="receita" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="despesa" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="mes" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              background: "#020617",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "16px",
              color: "#fff"
            }}
          />

          <Area
            type="monotone"
            dataKey="receita"
            stroke="#22c55e"
            fillOpacity={1}
            fill="url(#receita)"
          />

          <Area
            type="monotone"
            dataKey="despesa"
            stroke="#f59e0b"
            fillOpacity={1}
            fill="url(#despesa)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
