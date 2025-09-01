// src/components/Overview.tsx
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fmt } from "../lib/format";

type Props = {
  tvl?: number;
  users?: number;
  symbol?: string;
  assets: string[];
  apr7d?: number;
};

const COLORS = [
  "#6366F1",
  "#22C55E",
  "#F59E0B",
  "#06B6D4",
  "#EF4444",
  "#A855F7",
];

export default function Overview({ tvl, users, symbol, assets, apr7d }: Props) {
  // If no allocation weights are provided by the API, show equal weights (clearly labeled).
  const data =
    assets.length > 0
      ? assets.map((a, idx) => ({ name: a.toUpperCase(), value: 1, idx }))
      : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* TVL Summary */}
      <div className="p-4 rounded-xl border flex flex-col justify-between">
        <div className="text-sm text-gray-500">Total Value Locked</div>
        <div className="mt-1 text-2xl font-semibold">{fmt.usd(tvl)}</div>
        <div className="mt-2 text-xs text-gray-500">
          {symbol ? `Vault: ${symbol}` : "—"}
        </div>
        <div className="mt-3 inline-flex items-center gap-2">
          <span className="text-xs text-gray-500">7D APY</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {apr7d != null ? `${apr7d.toFixed(2)}%` : "—"}
          </span>
        </div>
      </div>

      {/* Users */}
      <div className="p-4 rounded-xl border">
        <div className="text-sm text-gray-500">Active Users</div>
        <div className="mt-1 text-2xl font-semibold">
          {users != null ? users.toLocaleString() : "—"}
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Number provided by /vault/summary (global)
        </div>
      </div>

      {/* Composition Donut */}
      <div className="p-4 rounded-xl border">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Vault Composition</div>
            <div className="text-xs text-gray-400">
              Equal-weight preview (allocation data not exposed yet)
            </div>
          </div>
        </div>

        <div className="h-48 mt-2">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={2}
                >
                  {data.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={24} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-gray-500">
              No asset data
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
