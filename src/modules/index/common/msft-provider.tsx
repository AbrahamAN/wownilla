"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { isMsftData } from "./msft-data";
import type { MsftData } from "./msft-data";

const MsftContext = createContext<{
  data: MsftData | null;
  failed: boolean;
  checkedAt: number;
}>({ data: null, failed: false, checkedAt: 0 });

/** Shares one abortable, visible-tab polling lifecycle across navbar and repeated contract controls. */
export function MsftProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    data: MsftData | null;
    failed: boolean;
    checkedAt: number;
  }>({ data: null, failed: false, checkedAt: 0 });
  useEffect(() => {
    let disposed = false;
    let controller: AbortController | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    async function refresh() {
      if (disposed || document.hidden) return;
      controller?.abort();
      clearTimeout(timer);
      const request = new AbortController();
      controller = request;
      try {
        const response = await fetch("/api/msft", {
          signal: request.signal,
          cache: "no-store",
        });
        const data: unknown = await response.json();
        if (!response.ok || !isMsftData(data))
          throw new Error("Unverified MSFT response");
        if (!disposed && !request.signal.aborted && controller === request)
          setState({ data, failed: false, checkedAt: Date.now() });
      } catch {
        if (!disposed && !request.signal.aborted)
          setState((previous) => ({
            ...previous,
            failed: true,
            checkedAt: Date.now(),
          }));
      } finally {
        if (
          !disposed &&
          !document.hidden &&
          !request.signal.aborted &&
          controller === request
        )
          timer = setTimeout(refresh, 60000);
      }
    }
    function visibility() {
      clearTimeout(timer);
      controller?.abort();
      if (!document.hidden) void refresh();
    }
    void refresh();
    document.addEventListener("visibilitychange", visibility);
    return () => {
      disposed = true;
      clearTimeout(timer);
      controller?.abort();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return <MsftContext.Provider value={state}>{children}</MsftContext.Provider>;
}

/** Reads the shared MSFT snapshot without creating another request or timer. */
export function useMsft() {
  return useContext(MsftContext);
}
