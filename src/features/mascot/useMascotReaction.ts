import { useEffect } from "react";
import { MascotReaction, MascotReactionEvent } from "./mascot.types";

const reactionDurations: Record<MascotReaction, number> = {
  "habit-done": 720,
  "perfect-day": 1400,
  "streak-record": 1400,
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function useMascotReaction(
  reaction: MascotReactionEvent | null | undefined,
  onReactionComplete?: (reactionId: number) => void,
) {
  useEffect(() => {
    if (!reaction) return undefined;

    const reactionId = reaction.id;
    const duration = prefersReducedMotion() ? 80 : reactionDurations[reaction.type];
    const timer = window.setTimeout(() => {
      onReactionComplete?.(reactionId);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [reaction, onReactionComplete]);

  return reaction?.type ?? null;
}
