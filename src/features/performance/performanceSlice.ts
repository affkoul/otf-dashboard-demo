import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { fetchVaultPerformance, fetchVaultBasic } from "../../lib/api";
import type { VaultPerfItem, VaultBasic } from "../../lib/api";

type State = {
  loading: boolean;
  error?: string;
  series: VaultPerfItem[];
  basic?: VaultBasic;
  lastVault?: string; // persisted
};

const initialState: State = {
  loading: false,
  series: [],
  lastVault: import.meta.env.VITE_TARGET_VAULT,
};

export const loadVaultData = createAsyncThunk(
  "performance/loadVaultData",
  async (vault: string) => {
    const [perf, basic] = await Promise.all([
      fetchVaultPerformance(vault),
      fetchVaultBasic(vault),
    ]);

    return { series: perf, basic, vault };
  },
);

const slice = createSlice({
  name: "performance",
  initialState,
  reducers: {
    setVault(state, action: PayloadAction<string>) {
      state.lastVault = action.payload;
    },
  },
  extraReducers: (b) => {
    b.addCase(loadVaultData.pending, (s) => {
      s.loading = true;
      s.error = undefined;
    });
    b.addCase(loadVaultData.fulfilled, (s, a) => {
      s.loading = false;
      s.series = a.payload.series;
      s.basic = a.payload.basic;
      s.lastVault = a.payload.vault;
    });
    b.addCase(loadVaultData.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message;
    });
  },
});

export const { setVault } = slice.actions;
export default slice.reducer;
