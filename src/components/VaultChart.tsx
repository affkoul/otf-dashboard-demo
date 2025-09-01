import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { fmt } from "../lib/format";

type Point = { unitNAV: number; APR7d: number; TVL: number; EndTime: number };
export default function VaultChart({ data }: { data: Point[] }) {
  const xFmt = (ts: number) => fmt.date(ts);
  return (
    <div className="p-4 rounded-xl border">
      <div className="font-semibold mb-2">
        Performance (Unit NAV / 7D APY / TVL)
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="EndTime" tickFormatter={xFmt} />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip labelFormatter={(v) => xFmt(Number(v))} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="unitNAV"
            dot={false}
            name="Unit NAV"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="APR7d"
            dot={false}
            name="7D APY"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="TVL"
            dot={false}
            name="TVL"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
