import { useEffect, useState } from "react";

export type MotionPreference = "full" | "reduced";

function readPreference(): MotionPreference {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return "full";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "full";
}

export function useMotionPreference(): MotionPreference {
  const [preference, setPreference] = useState<MotionPreference>(readPreference);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPreference(query.matches ? "reduced" : "full");
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return preference;
}
