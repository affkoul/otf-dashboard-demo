// const BASE = import.meta.env.VITE_PARTNER_API_BASE as string;
// const API = import.meta.env.VITE_API_BASE as string;
const API = "https://otf.lorenzo-protocol.xyz/lorenzo/v1";
// const PRICE_API = import.meta.env.VITE_PRICE_API as string | undefined;
const PRICE_API = "https://lorenzo-api.lorenzo-protocol.xyz/api";

type ListItem = {
  chain_id: number;
  chain_name: string;
  vault_name: string;
  vault_addr: string;
  symbol: string;
  distribution: string;
  supported_assets: string[];
  unit_nav: string; // 18 decimals
  unit_nav_rate: number;
  tvl: string; // big int as string
  tvl_rate: number;
  apr7d: number;
  apr7d_rate: number;
  risk_scale: string;
  manager_name: string;
  manager_url: string;
  portfolios: { weight: string; portfolio: string; description: string }[];
  vault_logo_url: string;
};

type ApiEnvelope<T> = { code: number; message: string; data: T };

export type VaultBasic = {
  unitNAV: number;
  APR7d: number;
  APR30d?: number | null;
  TVL: number;
  userAmount?: number | null;
  symbol: string;
};

export type VaultPerfItem = {
  unitNAV: number;
  APR7d: number;
  TVL: number;
  EndTime: number; // unix seconds
};

function parse18(s: string) {
  // quick 18-decimal parser; fine for UI (not for accounting)
  if (!s) return 0;
  const pad = s.padStart(19, "0");
  const int = pad.slice(0, -18) || "0";
  const frac = pad.slice(-18).replace(/0+$/, "");
  return parseFloat(frac ? `${int}.${frac}` : int);
}

function toNumber(s: string | number) {
  return typeof s === "number" ? s : parse18(s);
}

export async function fetchVaultList() {
  const res = await fetch(`${API}/simplevault/list`);
  if (!res.ok) throw new Error(`list: ${res.status}`);
  const json = (await res.json()) as ApiEnvelope<ListItem[]>;
  if (json.code !== 0) throw new Error(json.message || "list failed");
  return json.data;
}

export async function fetchVaultSummary() {
  const res = await fetch(`${API}/vault/summary`);
  if (!res.ok) throw new Error(`summary: ${res.status}`);
  const json = (await res.json()) as ApiEnvelope<{
    apr: number;
    tvl: string;
    active_vaults: number;
    users: number;
  }>;
  if (json.code !== 0) throw new Error(json.message || "summary failed");
  return json.data;
}

export async function fetchVaultBasic(
  vaultAddress: string,
): Promise<VaultBasic> {
  const [list, summary] = await Promise.all([
    fetchVaultList(),
    fetchVaultSummary().catch(() => null),
  ]);
  const item = list.find(
    (v) => v.vault_addr.toLowerCase() === vaultAddress.toLowerCase(),
  );
  if (!item) throw new Error("Vault not found in simplevault/list");

  return {
    unitNAV: toNumber(item.unit_nav),
    APR7d: item.apr7d,
    APR30d: null, // not provided by this API
    TVL: toNumber(item.tvl),
    userAmount: summary?.users ?? null, // summary is global, not per-vault
    symbol: item.symbol,
  };
}

/**
 * No perf endpoint in the live API dump you found.
 * Return an empty series for now so the chart renders gracefully.
 * If/when they expose e.g. /lorenzo/v1/simplevault/performance?address=..., wire it here.
 */
export async function fetchVaultPerformance(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _vaultAddress: string,
): Promise<VaultPerfItem[]> {
  return [];
}

// Optional helpers you might want later:
export async function fetchAssetsAndChains() {
  const res = await fetch(`${API}/vault/chain/asset`);
  if (!res.ok) throw new Error(`assets/chains: ${res.status}`);
  const json = (await res.json()) as ApiEnvelope<{
    assets: Array<{
      asset_address: string;
      asset_symbol: string;
      asset_name: string;
      asset_logo_url: string;
    }>;
    chains: Array<{
      chain_id: number;
      chain_name: string;
      chain_logo_url: string;
    }>;
  }>;
  if (json.code !== 0) throw new Error(json.message || "assets/chains failed");
  return json.data;
}

export async function fetchBtcPrice() {
  if (!PRICE_API) return null;
  const res = await fetch(`${PRICE_API}/tx/btc-price`);
  if (!res.ok) throw new Error(`btc-price: ${res.status}`);
  const json = (await res.json()) as { price: string };
  return parseFloat(json.price);
}

// type VaultPerfItem = {
//   unitNAV: number;
//   PnL: number;
//   APR7d: number;
//   APR30d: number;
//   Symbol: string;
//   StartTime: number;
//   EndTime: number;
//   TVL: number;
// };

// export async function fetchVaultPerformance(vaultAddress: string) {
//   const res = await fetch(`${BASE}/partner/v1/vault/performance`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ address: vaultAddress }),
//   });
//   if (!res.ok) throw new Error(`API error ${res.status}`);
//   const data: VaultPerfItem[] = await res.json();
//   return data;
// }

// type VaultBasic = {
//   address: string;
//   unitNAV: number;
//   PnL: number;
//   APR7d: number;
//   APR30d: number;
//   Chains: string[];
//   Symbol: string;
//   userAmount: number;
//   TVL: number;
//   underlying: string;
// };

// export async function fetchVaultBasic(vaultAddress: string) {
//   const res = await fetch(`${BASE}/partner/v1/vault/basic`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ address: vaultAddress }),
//   });
//   if (!res.ok) throw new Error(`API error ${res.status}`);
//   const data: VaultBasic = await res.json();
//   return data;
// }
