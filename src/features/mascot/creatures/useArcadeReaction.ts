import { useEffect, type RefObject } from "react";
import type { MascotReaction } from "../mascot.types";

type GsapVars = Record<string, unknown>;
type GsapTimeline = {
  to: (target: unknown, vars: GsapVars, position?: string | number) => GsapTimeline;
  fromTo: (target: unknown, fromVars: GsapVars, toVars: GsapVars, position?: string | number) => GsapTimeline;
  kill: () => void;
};
type GsapApi = {
  timeline: (vars?: GsapVars) => GsapTimeline;
  set: (target: unknown, vars: GsapVars) => void;
  killTweensOf: (target: unknown) => void;
};

declare global {
  interface Window {
    gsap?: GsapApi;
  }
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function reset(gsap: GsapApi, root: SVGSVGElement) {
  const targets = root.querySelectorAll<SVGElement>("[data-gsap]");
  const particles = root.querySelectorAll<SVGElement>(".arcade-burst-particle");
  gsap.set(targets, { clearProps: "transform,opacity" });
  gsap.set(particles, { opacity: 0, clearProps: "transform" });
}

function playReaction(gsap: GsapApi, root: SVGSVGElement, reaction: MascotReaction) {
  const body = root.querySelector<SVGElement>(".arcade-body-motion");
  const face = root.querySelector<SVGElement>(".arcade-face-motion");
  const eyes = root.querySelectorAll<SVGElement>(".arcade-eye");
  const glow = root.querySelector<SVGElement>(".arcade-glow-motion");
  const particles = Array.from(root.querySelectorAll<SVGElement>(".arcade-burst-particle"));
  const targets = root.querySelectorAll<SVGElement>("[data-gsap]");

  gsap.killTweensOf(targets);
  reset(gsap, root);
  gsap.set([body, face, glow, particles], { transformOrigin: "50% 50%" });

  const timeline = gsap.timeline({
    defaults: { overwrite: "auto" },
    onComplete: () => reset(gsap, root),
  });

  if (reaction === "habit-done") {
    return timeline
      .to(body, { y: -12, scaleY: 1.08, duration: 0.16, ease: "steps(4)" })
      .to(eyes, { x: 5, duration: 0.1, ease: "steps(1)" }, "<")
      .fromTo(particles, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1.15, duration: 0.24, stagger: 0.03, ease: "steps(3)" }, "<0.04")
      .to(body, { y: 0, scaleY: 1, duration: 0.24, ease: "steps(4)" })
      .to(particles, { opacity: 0, duration: 0.12 }, "-=0.12");
  }

  if (reaction === "perfect-day") {
    return timeline
      .to(body, { y: -24, scale: 1.12, rotation: -4, duration: 0.24, ease: "steps(5)" })
      .to(face, { scale: 1.1, duration: 0.12, yoyo: true, repeat: 1 }, "<")
      .to(glow, { scale: 1.35, opacity: 1, duration: 0.2 }, "<")
      .fromTo(particles, { opacity: 0, scale: 0.25, y: 8 }, { opacity: 1, scale: 1.35, y: -10, rotation: 90, duration: 0.42, stagger: 0.035, ease: "steps(5)" }, "<0.05")
      .to(body, { y: 2, rotation: 4, duration: 0.2, ease: "steps(3)" })
      .to([body, glow], { y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.28, ease: "steps(5)" })
      .to(particles, { opacity: 0, duration: 0.16 }, "-=0.2");
  }

  return timeline
    .to(body, { x: -8, rotation: -6, duration: 0.14, ease: "steps(2)" })
    .to(body, { x: 8, rotation: 6, duration: 0.14, ease: "steps(2)" })
    .to(body, { x: -4, rotation: -3, duration: 0.12, ease: "steps(2)" })
    .fromTo(particles, { opacity: 0, scale: 0.35 }, { opacity: 1, scale: 1.2, duration: 0.3, stagger: 0.025, ease: "steps(4)" }, "<")
    .to(body, { x: 0, rotation: 0, duration: 0.2, ease: "steps(3)" })
    .to(particles, { opacity: 0, duration: 0.14 }, "-=0.12");
}

export function useArcadeReaction(svgRef: RefObject<SVGSVGElement>, reaction: MascotReaction | null) {
  useEffect(() => {
    if (!reaction || prefersReducedMotion()) return undefined;

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
      if (gsap && root) reset(gsap, root);
    };
  }, [reaction, svgRef]);
}