// src/app/persist.ts
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import type { PersistConfig } from "redux-persist";
import type { Reducer, UnknownAction } from "@reduxjs/toolkit";

const DEFAULT_BLACKLIST = ["loading", "error"] as const;
export function makePersisted<
  S extends Record<string, unknown>,
  A extends UnknownAction = UnknownAction,
>(key: string, reducer: Reducer<S, A>) {
  const persistConfig: PersistConfig<S> = {
    key,
    storage,
    version: 1,
    // Keep it a plain string[] to satisfy PersistConfig
    blacklist: [...DEFAULT_BLACKLIST],
  };

  return persistReducer<S, A>(persistConfig, reducer);
}

export { persistStore };
