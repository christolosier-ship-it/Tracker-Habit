import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import type { MascotReaction } from "./mascot.types";
import { prefersReducedMotion } from "../../hooks/useMotionPreference";

export { gsap };

export type PlayGsapReaction = (
  root: SVGSVGElement,
  reaction: MascotReaction,
) => gsap.core.Timeline;

export type ResetGsapReaction = (root: SVGSVGElement) => void;

export type GsapReactionDefinition = {
  play: PlayGsapReaction;
  reset: ResetGsapReaction;
};

export function useGsapReactionRuntime(
  svgRef: RefObject<SVGSVGElement | null>,
  reaction: MascotReaction | null,
  playReaction: PlayGsapReaction,
  resetReaction: ResetGsapReaction,
  onComplete?: () => void,
) {
  useEffect(() => {
    const root = svgRef.current;
    if (!reaction || !root || prefersReducedMotion()) return undefined;

    const timeline = playReaction(root, reaction);
    const previousOnComplete = timeline.eventCallback("onComplete");
    timeline.eventCallback("onComplete", () => {
      if (typeof previousOnComplete === "function") previousOnComplete();
      onComplete?.();
    });

    return () => {
      timeline.kill();
      gsap.killTweensOf(root.querySelectorAll("[data-gsap]"));
      resetReaction(root);
    };
  }, [onComplete, playReaction, reaction, resetReaction, svgRef]);
}
