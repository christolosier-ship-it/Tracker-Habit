import { useEffect } from "react";
import { AppData, saveData } from "../persistence";

export function useDebouncedSave(data: AppData, delay = 350) {
  useEffect(() => {
    const timeout = window.setTimeout(() => saveData(data), delay);
    return () => window.clearTimeout(timeout);
  }, [data, delay]);
}
