import WalletBar from "./components/WalletBar";
import VaultPage from "./pages/VaultPage";
import WsProbe from "./pages/WsProbe";

export default function App() {
  const showProbe = new URLSearchParams(location.search).get("probe") === "1";
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">OTF Dashboard (Demo)</h1>
        <WalletBar />
      </div>
      {showProbe ? <WsProbe /> : <VaultPage />}
      <footer className="pt-6 text-xs text-gray-500">
        Demo for Lorenzo OTF UX • Built with React, Wagmi, Redux Toolkit,
        redux-persist
        <span className="ml-2">
          (
          <a className="underline" href="?probe=1">
            WS Probe
          </a>{" "}
          /{" "}
          <a className="underline" href="/">
            Dashboard
          </a>
          )
        </span>
      </footer>
    </div>
  );
}
