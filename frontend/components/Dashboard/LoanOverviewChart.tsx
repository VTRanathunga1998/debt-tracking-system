//
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { month: "Jan", totalLoans: 45000, activeLoans: 35000, repaidLoans: 10000 },
  { month: "Feb", totalLoans: 52000, activeLoans: 40000, repaidLoans: 12000 },
  { month: "Mar", totalLoans: 61000, activeLoans: 45000, repaidLoans: 16000 },
  { month: "Apr", totalLoans: 67000, activeLoans: 48000, repaidLoans: 19000 },
  { month: "May", totalLoans: 75000, activeLoans: 52000, repaidLoans: 23000 },
  { month: "Jun", totalLoans: 82000, activeLoans: 55000, repaidLoans: 27000 },
];

export default function LoanOverviewChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 15,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
        <Tooltip
          formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
          labelStyle={{ color: "#111827" }}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="totalLoans"
          stackId="1"
          stroke="#4F46E5"
          fill="#818CF8"
          name="Total Loans"
        />
        <Area
          type="monotone"
          dataKey="activeLoans"
          stackId="1"
          stroke="#059669"
          fill="#34D399"
          name="Active Loans"
        />
        <Area
          type="monotone"
          dataKey="repaidLoans"
          stackId="1"
          stroke="#DC2626"
          fill="#F87171"
          name="Repaid Loans"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
