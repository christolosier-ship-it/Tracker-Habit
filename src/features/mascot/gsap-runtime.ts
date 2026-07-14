import { useEffect, type RefObject } from "react";
import type { MascotReaction } from "./mascot.types";

export type GsapVars = Record<string, unknown>;

export type GsapTimeline = {
  to: (target: unknown, vars: GsapVars, position?: string | number) => GsapTimeline;
  fromTo: (
    target: unknown,
    fromVars: GsapVars,
    toVars: GsapVars,
    position?: string | number,
  ) => GsapTimeline;
  kill: () => void;
};

export type GsapApi = {
  timeline: (vars?: GsapVars) => GsapTimeline;
  set: (target: unknown, vars: GsapVars) => void;
  killTweensOf: (target: unknown) => void;
};

declare global {
  interface Window {
    gsap?: GsapApi;
  }
}

type PlayReaction = (
  gsap: GsapApi,
  root: SVGSVGElement,
  reaction: MascotReaction,
) => GsapTimeline;

type ResetReaction = (gsap: GsapApi, root: SVGSVGElement) => void;

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useGsapReactionRuntime(
  svgRef: RefObject<SVGSVGElement | null>,
  reaction: MascotReaction | null,
  playReaction: PlayReaction,
  resetReaction: ResetReaction,
) {
  useEffect(() => {
    if (!reaction || reducedMotion()) return undefined;

    let cancelled = false;
    let frameId = 0;
    let timeline: GsapTimeline | undefined;
    let attempts = 0;

    const start = () => {
      if (cancelled) return;
      const gsap = window.gsap;
      const root = svgRef.current;
      if (!gsap || !root) {
        attempts += 1;
        if (attempts < 120) frameId = window.requestAnimationFrame(start);
        return;
      }
      timeline = playReaction(gsap, root, reaction);
    };

    start();
    return () => {
      cancelled = true;
      if (frameId) window.cancelAnimationFrame(frameId);
      timeline?.kill();
      const gsap = window.gsap;
      const root = svgRef.current;
      if (gsap && root) resetReaction(gsap, root);
    };
  }, [playReaction, reaction, resetReaction, svgRef]);
}
