// import { fmt } from "../lib/format";

type Props = {
  unitNAV?: number | null;
  apr7d?: number | null;
  apr30d?: number | null;
  tvl?: number | null;
  users?: number | null;
  symbol?: string | null;
};

const Card = ({ title, value }: { title: string; value: string }) => (
  <div className="p-4 rounded-xl border flex-1">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="text-xl font-semibold">{value}</div>
  </div>
);

export default function StatCards(p: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Card title="Unit NAV" value={p.unitNAV?.toFixed(6) ?? "—"} />
      <Card
        title="7D APY"
        value={p.apr7d != null ? `${p.apr7d.toFixed(2)}%` : "—"}
      />
      {/* <Card
        title="30D APY"
        value={
          p.apr30d != null ? `${p.apr30d.toFixed(2)}%` : "Not Available Yet"
        }
      /> */}
      {/* <Card title="TVL" value={p.tvl != null ? fmt.usd(p.tvl) : "—"} /> */}
      {/* <Card title="Users" value={p.users?.toLocaleString() ?? "—"} /> */}
      <Card title="Symbol" value={p.symbol ?? "—"} />
    </div>
  );
}
