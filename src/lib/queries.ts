// src/lib/queries.ts
import { useQuery } from "@tanstack/react-query";
import { fetchVaultList, fetchVaultBasic } from "./api";

export function useVaultListPolling() {
  return useQuery({
    queryKey: ["vault-list"],
    queryFn: fetchVaultList,
    refetchInterval: 30000, // 30s
    staleTime: 15000,
  });
}

export function useVaultBasicPolling(vaultAddr?: string) {
  return useQuery({
    queryKey: ["vault-basic", vaultAddr],
    queryFn: () => fetchVaultBasic(vaultAddr!),
    enabled: !!vaultAddr,
    refetchInterval: 30000,
    staleTime: 15000,
  });
}
