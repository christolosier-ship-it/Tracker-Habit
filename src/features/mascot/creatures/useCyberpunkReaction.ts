import { useEffect, type RefObject } from "react";
import type { MascotReaction } from "../mascot.types";

type GsapVars = Record<string, unknown>;

type GsapTimeline = {
  to: (
    target: unknown,
    vars: GsapVars,
    position?: string | number,
  ) => GsapTimeline;
  fromTo: (
    target: unknown,
    fromVars: GsapVars,
    toVars: GsapVars,
    position?: string | number,
  ) => GsapTimeline;
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

const transformTargetSelector = [
  ".cyber-body-motion",
  ".cyber-arm-motion-left",
  ".cyber-arm-motion-right",
  ".cyber-rotor-motion-left",
  ".cyber-rotor-motion-right",
  ".cyber-propeller",
  ".cyber-reactor-motion",
  ".cyber-face",
  ".cyber-status-ring",
].join(",");

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function resetAnimatedParts(gsap: GsapApi, root: SVGSVGElement) {
  const transformTargets = root.querySelectorAll<SVGElement>(
    transformTargetSelector,
  );
  const particles = root.querySelectorAll<SVGElement>(".cyber-particle");
  const ring = root.querySelector<SVGElement>(".cyber-status-ring");

  gsap.set(transformTargets, { clearProps: "transform" });
  gsap.set(ring, { clearProps: "opacity" });
  gsap.set(particles, { opacity: 0, clearProps: "transform" });
}

function playReaction(
  gsap: GsapApi,
  root: SVGSVGElement,
  reaction: MascotReaction,
) {
  const body = root.querySelector<SVGElement>(".cyber-body-motion");
  const leftArm = root.querySelector<SVGElement>(".cyber-arm-motion-left");
  const rightArm = root.querySelector<SVGElement>(".cyber-arm-motion-right");
  const leftRotor = root.querySelector<SVGElement>(".cyber-rotor-motion-left");
  const rightRotor = root.querySelector<SVGElement>(".cyber-rotor-motion-right");
  const propellers = root.querySelectorAll<SVGElement>(".cyber-propeller");
  const reactor = root.querySelector<SVGElement>(".cyber-reactor-motion");
  const face = root.querySelector<SVGElement>(".cyber-face");
  const ring = root.querySelector<SVGElement>(".cyber-status-ring");
  const particles = Array.from(
    root.querySelectorAll<SVGElement>(".cyber-particle"),
  );
  const animatedParts = root.querySelectorAll<SVGElement>("[data-gsap]");

  gsap.killTweensOf(animatedParts);
  resetAnimatedParts(gsap, root);
  gsap.set(body, { transformOrigin: "50% 50%" });
  gsap.set([leftArm, rightArm], { transformOrigin: "50% 14%" });
  gsap.set([leftRotor, rightRotor], { transformOrigin: "50% 70%" });
  gsap.set(propellers, { transformOrigin: "50% 50%" });
  gsap.set(reactor, { transformOrigin: "50% 0%" });
  gsap.set(face, { transformOrigin: "50% 50%" });
  gsap.set(ring, { transformOrigin: "50% 50%" });
  gsap.set(particles, {
    opacity: 0,
    scale: 0.45,
    transformOrigin: "50% 50%",
  });

  const timeline = gsap.timeline({
    defaults: { overwrite: "auto" },
    onComplete: () => resetAnimatedParts(gsap, root),
  });

  if (reaction === "habit-done") {
    return timeline
      .to(body, {
        y: -12,
        scaleX: 1.06,
        scaleY: 0.93,
        duration: 0.17,
        ease: "power2.out",
      })
      .to(leftArm, { rotation: -18, duration: 0.2, ease: "power2.out" }, "<")
      .to(rightArm, { rotation: 18, duration: 0.2, ease: "power2.out" }, "<")
      .to(reactor, { scaleY: 1.35, duration: 0.18, ease: "power2.out" }, "<")
      .fromTo(
        particles,
        { opacity: 0, scale: 0.35, y: 4 },
        {
          opacity: 1,
          scale: 1.15,
          y: -5,
          duration: 0.26,
          stagger: 0.025,
          ease: "back.out(2.4)",
        },
        "<0.04",
      )
      .to(body, {
        y: 2,
        scaleX: 0.97,
        scaleY: 1.04,
        duration: 0.18,
        ease: "power2.in",
      })
      .to(
        [body, leftArm, rightArm, reactor],
        {
          y: 0,
          rotation: 0,
          scale: 1,
          scaleX: 1,
          scaleY: 1,
          duration: 0.25,
          ease: "back.out(2)",
        },
        "<",
      )
      .to(particles, { opacity: 0, scale: 0.55, duration: 0.16 }, "-=0.18");
  }

  if (reaction === "perfect-day") {
    return timeline
      .to(body, {
        y: -25,
        scale: 1.08,
        duration: 0.27,
        ease: "power3.out",
      })
      .to(leftArm, { rotation: -66, y: -4, duration: 0.3, ease: "back.out(2)" }, "<")
      .to(rightArm, { rotation: 66, y: -4, duration: 0.3, ease: "back.out(2)" }, "<")
      .to([leftRotor, rightRotor], { y: -6, scale: 1.08, duration: 0.25 }, "<")
      .to(propellers, { rotation: "+=720", duration: 0.52, ease: "power2.inOut" }, "<")
      .to(reactor, { scaleY: 1.65, scaleX: 1.18, duration: 0.24 }, "<")
      .fromTo(
        particles,
        { opacity: 0, scale: 0.2, y: 8 },
        {
          opacity: 1,
          scale: 1.35,
          y: -9,
          rotation: 36,
          duration: 0.42,
          stagger: 0.035,
          ease: "back.out(3)",
        },
        "<0.08",
      )
      .to(face, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1 }, "<")
      .to(body, { y: 3, scale: 0.98, duration: 0.28, ease: "power2.in" })
      .to(
        [body, leftArm, rightArm, leftRotor, rightRotor, reactor],
        {
          y: 0,
          rotation: 0,
          scale: 1,
          scaleX: 1,
          scaleY: 1,
          duration: 0.34,
          ease: "elastic.out(1, 0.55)",
        },
      )
      .to(particles, { opacity: 0, scale: 0.4, duration: 0.2 }, "-=0.3");
  }

  return timeline
    .to(ring, { scale: 1.35, opacity: 0.95, duration: 0.28, ease: "power2.out" })
    .to(body, { rotation: -8, y: -10, duration: 0.22, ease: "power2.out" }, "<")
    .to(leftArm, { rotation: -58, duration: 0.25, ease: "back.out(2)" }, "<")
    .to(rightArm, { rotation: 24, duration: 0.25, ease: "back.out(2)" }, "<")
    .to(propellers, { rotation: "+=540", duration: 0.46, ease: "power2.inOut" }, "<")
    .fromTo(
      particles,
      { opacity: 0, scale: 0.25, rotation: -30 },
      {
        opacity: 1,
        scale: 1.2,
        rotation: 30,
        duration: 0.36,
        stagger: 0.03,
        ease: "back.out(2.6)",
      },
      "<0.06",
    )
    .to(body, { rotation: 8, duration: 0.2, ease: "sine.inOut" })
    .to(body, { rotation: -4, duration: 0.16, ease: "sine.inOut" })
    .to(
      [body, leftArm, rightArm, ring],
      {
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 0.34,
        ease: "back.out(2)",
      },
    )
    .to(particles, { opacity: 0, scale: 0.45, duration: 0.2 }, "-=0.24");
}

export function useCyberpunkReaction(
  svgRef: RefObject<SVGSVGElement>,
  reaction: MascotReaction | null,
) {
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
      if (gsap && root) resetAnimatedParts(gsap, root);
    };
  }, [reaction, svgRef]);
}
