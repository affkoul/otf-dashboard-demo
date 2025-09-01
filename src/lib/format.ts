export const fmt = {
  usd(n: number | undefined) {
    if (n == null) return "—";
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(n);
  },
  pct(n: number | undefined) {
    if (n == null) return "—";
    return `${n.toFixed(2)}%`;
  },
  date(ts: number) {
    return new Date(ts * 1000).toLocaleDateString();
  },
};
