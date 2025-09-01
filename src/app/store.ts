import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { makePersisted, persistStore } from "./persist";
import performanceReducer from "../features/performance/performanceSlice";
import walletReducer from "../features/wallet/walletSlice";

const rootReducer = combineReducers({
  performance: makePersisted("performance", performanceReducer),
  wallet: makePersisted("wallet", walletReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: false, // needed for redux-persist
    }),
  devTools: true,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
