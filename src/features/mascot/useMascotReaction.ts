import { useCallback, useEffect, useRef } from "react";
import type { MascotReactionEvent } from "./mascot.types";
import { prefersReducedMotion } from "../../hooks/useMotionPreference";

const WATCHDOG_MS = 3500;

export function useMascotReaction(
  reaction: MascotReactionEvent | null | undefined,
  onReactionComplete?: (reactionId: number) => void,
) {
  const completedIdRef = useRef<number | null>(null);

  useEffect(() => {
    completedIdRef.current = null;
    if (!reaction) return undefined;
    const delay = prefersReducedMotion() ? 80 : WATCHDOG_MS;
    const timer = window.setTimeout(() => {
      if (completedIdRef.current === reaction.id) return;
      completedIdRef.current = reaction.id;
      onReactionComplete?.(reaction.id);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [reaction, onReactionComplete]);

  const complete = useCallback(() => {
    if (!reaction || completedIdRef.current === reaction.id) return;
    completedIdRef.current = reaction.id;
    onReactionComplete?.(reaction.id);
  }, [reaction, onReactionComplete]);

  return { activeReaction: reaction?.type ?? null, complete };
}
