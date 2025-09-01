export type WSStatus = "idle" | "connecting" | "open" | "closed" | "error";

type Options = {
  endpoints: string[]; // candidates, we’ll try in order
  onMessage?: (data: unknown, raw: MessageEvent) => void;
  onStatus?: (s: WSStatus, info?: string) => void;
  heartbeatMs?: number; // ping interval
  makePing?: () => string | ArrayBufferLike | Blob | ArrayBufferView; // what to send as ping
};

export function createWsClient(opts: Options) {
  let ws: WebSocket | null = null;
  let index = 0;
  let heartbeat: ReturnType<typeof setInterval> | null = null;
  let closedByUser = false;

  const status = (s: WSStatus, info?: string) => opts.onStatus?.(s, info);

  async function tryConnect(): Promise<void> {
    if (index >= opts.endpoints.length) {
      status("error", "All WS endpoints failed");
      return;
    }
    const url = opts.endpoints[index];
    status("connecting", url);
    try {
      ws = new WebSocket(url);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      index++;
      setTimeout(tryConnect, 500);
      return;
    }

    ws.onopen = () => {
      status("open", url);
      if (opts.heartbeatMs && opts.makePing) {
        heartbeat = setInterval(() => {
          if (ws?.readyState === WebSocket.OPEN) {
            try {
              ws.send(opts.makePing!());
            } catch {
              /* empty */
            }
          }
        }, opts.heartbeatMs);
      }
    };

    ws.onmessage = (evt) => {
      let parsed: unknown = evt.data;
      try {
        parsed = JSON.parse(String(evt.data));
      } catch {
        /* empty */
      }
      opts.onMessage?.(parsed, evt);
    };

    ws.onclose = () => {
      status("closed", url);
      if (heartbeat) {
        clearInterval(heartbeat);
        heartbeat = null;
      }
      if (!closedByUser) {
        // try next endpoint, then wrap to first
        index = (index + 1) % opts.endpoints.length;
        setTimeout(tryConnect, 800);
      }
    };

    ws.onerror = () => {
      status("error", url);
      try {
        ws?.close();
      } catch {
        /* empty */
      }
    };
  }

  function send(obj: unknown) {
    if (ws?.readyState === WebSocket.OPEN) {
      const payload = typeof obj === "string" ? obj : JSON.stringify(obj);
      ws.send(payload);
      return true;
    }
    return false;
  }

  function close() {
    closedByUser = true;
    if (heartbeat) {
      clearInterval(heartbeat);
      heartbeat = null;
    }
    try {
      ws?.close();
    } catch {
      /* empty */
    }
  }

  // kick off
  tryConnect();

  return { send, close };
}
