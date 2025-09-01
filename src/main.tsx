import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { Provider } from "react-redux";
import { store, persistor } from "./app/store";
import { PersistGate } from "redux-persist/integration/react";

import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "./lib/wagmi";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </WagmiProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
