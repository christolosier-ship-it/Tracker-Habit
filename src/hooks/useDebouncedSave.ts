import { useEffect, useRef } from "react";
import { AppData, saveData } from "../persistence";

export function useDebouncedSave(data: AppData, delay = 350) {
  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return undefined;
    }
    const timeout = window.setTimeout(() => saveData(data), delay);
    return () => window.clearTimeout(timeout);
  }, [data, delay]);
}
