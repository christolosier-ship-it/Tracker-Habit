import { useSyncExternalStore } from "react";

export type MotionPreference = "full" | "reduced";

function subscribe(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot(): MotionPreference {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "full";
}

function getServerSnapshot(): MotionPreference {
  return "full";
}

export function useMotionPreference(): MotionPreference {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
