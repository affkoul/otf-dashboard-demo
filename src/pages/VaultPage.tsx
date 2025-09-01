import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";
import {
  loadVaultData,
  setVault,
} from "../features/performance/performanceSlice";
import { fetchVaultList } from "../lib/api";
// import VaultChart from "../components/VaultChart";
import StatCards from "../components/StatCards";
import Overview from "../components/Overview";

type VaultOption = {
  vault_name: string;
  vault_addr: string;
  symbol: string;
  vault_logo_url: string;
  supported_assets: string[];
};

export default function VaultPage() {
  const dispatch = useDispatch<AppDispatch>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { series, basic, loading, error, lastVault } = useSelector(
    (s: RootState) => s.performance,
  );
  const [vaults, setVaults] = useState<VaultOption[]>([]);
  const selectedVault = vaults.find((v) => v.vault_addr === lastVault);

  useEffect(() => {
    fetchVaultList().then((data) =>
      setVaults(
        data.map((v) => ({
          vault_name: v.vault_name,
          vault_addr: v.vault_addr,
          symbol: v.symbol,
          vault_logo_url: v.vault_logo_url,
          supported_assets: v.supported_assets,
        })),
      ),
    );
  }, []);

  useEffect(() => {
    if (lastVault) dispatch(loadVaultData(lastVault));
  }, [dispatch, lastVault]);

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <div className="text-2xl font-bold">
            {basic?.symbol || "Select a vault"}
          </div>
          <div className="text-sm text-gray-500">Address: {lastVault}</div>
        </div>
        {/* Dropdown instead of free-text input */}
        <select
          className="border rounded-lg px-3 py-2 text-sm w-[320px] max-w-full"
          value={lastVault}
          onChange={(e) => dispatch(setVault(e.target.value))}
        >
          <option value="">-- Select Vault --</option>
          {vaults.map((v) => (
            <option key={v.vault_addr} value={v.vault_addr}>
              {v.symbol} — {v.vault_name}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="p-3 rounded-lg border bg-yellow-50">Loading…</div>
      )}
      {error && (
        <div className="p-3 rounded-lg border bg-red-50">Error: {error}</div>
      )}

      <StatCards
        unitNAV={basic?.unitNAV}
        apr7d={basic?.APR7d}
        apr30d={basic?.APR30d}
        tvl={basic?.TVL}
        users={basic?.userAmount}
        symbol={basic?.symbol}
      />

      <Overview
        tvl={basic?.TVL}
        users={basic?.userAmount ?? undefined}
        symbol={basic?.symbol}
        assets={selectedVault?.supported_assets ?? []}
        apr7d={basic?.APR7d}
      />

      {/* <VaultChart data={series} /> */}
    </div>
  );
}
