import { useEffect, useRef, useState } from "react";
import type { AppData } from "../persistence";
import { saveData } from "../persistence";

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout: number },
  ) => number;
  cancelIdleCallback?: (id: number) => void;
};

export function useDebouncedSave(data: AppData, delay = 350) {
  const isInitialRender = useRef(true);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return undefined;
    }

    let idleId: number | undefined;
    const timeout = window.setTimeout(() => {
      const persist = () => setSaveFailed(!saveData(data));
      const idleWindow = window as IdleWindow;
      idleId = idleWindow.requestIdleCallback?.(persist, { timeout: 1000 });
      if (idleId === undefined) persist();
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      if (idleId !== undefined) {
        (window as IdleWindow).cancelIdleCallback?.(idleId);
      }
    };
  }, [data, delay]);

  return saveFailed;
}
