import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { productivitySummary } from "../../data/mockFinancial.js";

export default function ProductivityChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={productivitySummary}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="nome" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              background: "#020617",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "16px",
              color: "#fff"
            }}
          />

          <Bar
            dataKey="produtividade"
            fill="#22c55e"
            radius={[14, 14, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
