import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useDispatch } from "react-redux";
import { setLastAddress } from "../features/wallet/walletSlice";

export default function WalletBar() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const dispatch = useDispatch();

  const short = (a?: string) => (a ? `${a.slice(0, 6)}...${a.slice(-4)}` : "—");

  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-xl border">
      <div className="font-semibold">Wallet</div>
      {!isConnected ? (
        <button
          className="px-3 py-2 rounded-lg bg-blue-600 text-white"
          onClick={async () => {
            await connect({ connector: connectors[0] });
            // address appears on next render; nothing to do now
          }}
          disabled={isPending}
        >
          {isPending ? "Connecting…" : "Connect"}
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700">{short(address)}</span>
          <button
            className="px-3 py-2 rounded-lg bg-gray-100"
            onClick={() => {
              dispatch(setLastAddress(address));
              disconnect();
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
