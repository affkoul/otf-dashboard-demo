import { http, createConfig } from "wagmi";
import { bsc } from "viem/chains"; // BNB Chain Mainnet
import { injected } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [bsc],
  connectors: [injected()],
  transports: { [bsc.id]: http() }, // default public RPC; swap with your provider if needed
});
