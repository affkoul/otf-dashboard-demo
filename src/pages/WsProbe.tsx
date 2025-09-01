import { useEffect, useMemo, useRef, useState } from "react";
import { createWsClient, type WSStatus } from "../lib/wsClient";

const DEFAULT_VAULT = import.meta.env.VITE_TARGET_VAULT as string;

const CANDIDATES = [
  // most common on services that already expose /lorenzo/v1 REST
  "wss://otf.lorenzo-protocol.xyz/lorenzo/v1/ws",
  "wss://otf.lorenzo-protocol.xyz/lorenzo/v1/stream",
  "wss://otf.lorenzo-protocol.xyz/lorenzo/v1/socket",
  // generic fallbacks
  "wss://otf.lorenzo-protocol.xyz/ws",
  "wss://otf.lorenzo-protocol.xyz/stream",
  // some gateways prepend /api
  "wss://otf.lorenzo-protocol.xyz/api/lorenzo/v1/ws",
];

export default function WsProbe() {
  const [status, setStatus] = useState<WSStatus>("idle");
  const [statusInfo, setStatusInfo] = useState<string>("");
  const [log, setLog] = useState<string[]>([]);
  const [endpointIdx, setEndpointIdx] = useState<number>(0);
  const [customMsg, setCustomMsg] = useState<string>("{}");
  const clientRef = useRef<ReturnType<typeof createWsClient> | null>(null);

  const endpoints = useMemo(() => {
    // rotate so the selected candidate is first
    const start = CANDIDATES[endpointIdx];
    const rest = CANDIDATES.filter((e) => e !== start);
    return [start, ...rest];
  }, [endpointIdx]);

  useEffect(() => {
    if (clientRef.current) clientRef.current.close();
    const client = createWsClient({
      endpoints,
      heartbeatMs: 15000,
      makePing: () => JSON.stringify({ type: "ping", t: Date.now() }),
      onStatus: (s, info) => {
        setStatus(s);
        setStatusInfo(info ?? "");
        if (s === "error") {
          setLog((prev) =>
            [`[${new Date().toISOString()}] <status> ${info}`, ...prev].slice(
              0,
              200,
            ),
          );
        }
      },
      onMessage: (data) => {
        const stamp = new Date().toISOString();
        const asText = typeof data === "string" ? data : JSON.stringify(data);
        setLog((prev) => [`[${stamp}] ${asText}`, ...prev].slice(0, 200));
      },
    });
    clientRef.current = client;
    return () => client.close();
  }, [endpoints]);

  function send(obj: string | Record<string, unknown>) {
    clientRef.current?.send(obj);
  }

  // Common guesses for subscribe frames (you can try each)
  const guesses = [
    {
      label: "Subscribe: vault basic",
      msg: {
        action: "subscribe",
        topic: "vault.basic",
        address: DEFAULT_VAULT,
      },
    },
    {
      label: "Subscribe: performance",
      msg: {
        action: "subscribe",
        topic: "vault.performance",
        address: DEFAULT_VAULT,
      },
    },
    {
      label: "Subscribe: list",
      msg: { action: "subscribe", topic: "vault.list" },
    },
    { label: "Ping", msg: { type: "ping", t: Date.now() } },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-3">
      <h2 className="text-2xl font-bold">WS Probe</h2>

      <div className="flex gap-2 items-center">
        <span className="text-sm">Endpoint:</span>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={endpointIdx}
          onChange={(e) => setEndpointIdx(Number(e.target.value))}
        >
          {CANDIDATES.map((u, i) => (
            <option key={u} value={i}>
              {u}
            </option>
          ))}
        </select>
        <span className="ml-auto text-sm">
          Status: <b>{status}</b>{" "}
          <span className="text-gray-500">{statusInfo}</span>
          <p className="text-xs text-gray-500">
            Tip: If all endpoints fail to CONNECT or never reply to
            PING/SUBSCRIBE, the service likely has no WS; rely on polling.
          </p>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="border rounded-xl p-3 space-y-2">
          <div className="font-semibold">Quick Send</div>
          <div className="grid grid-cols-1 gap-2">
            {guesses.map((g) => (
              <button
                key={g.label}
                className="px-3 py-2 rounded bg-blue-600 text-white text-sm"
                onClick={() => send(g.msg)}
              >
                {g.label}
              </button>
            ))}
          </div>
          <div className="mt-3 space-y-2">
            <div className="text-sm font-semibold">Custom JSON</div>
            <textarea
              className="w-full border rounded p-2 text-sm font-mono"
              rows={6}
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
            />
            <button
              className="px-3 py-2 rounded bg-gray-900 text-white text-sm"
              onClick={() => {
                try {
                  const obj = JSON.parse(customMsg);
                  send(obj);
                } catch {
                  send(customMsg);
                }
              }}
            >
              Send
            </button>
          </div>
        </div>

        <div className="border rounded-xl p-3">
          <div className="font-semibold mb-2">Incoming Messages</div>
          <div className="h-80 overflow-auto text-xs font-mono whitespace-pre-wrap">
            {log.map((line, i) => (
              <div key={i} className="border-b py-1">
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
