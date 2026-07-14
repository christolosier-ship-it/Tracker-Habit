import { useEffect } from "react";
import type { RefObject } from "react";
import type { MascotReaction } from "../mascot.types";

type TimelineLike = {
  to: (target: unknown, vars: Record<string, unknown>, position?: string | number) => TimelineLike;
  fromTo: (target: unknown, fromVars: Record<string, unknown>, toVars: Record<string, unknown>, position?: string | number) => TimelineLike;
  kill: () => void;
};

type GsapLike = {
  timeline: (options?: Record<string, unknown>) => TimelineLike;
  set: (target: unknown, vars: Record<string, unknown>) => void;
  killTweensOf: (target: unknown) => void;
};

declare global {
  interface Window { gsap?: GsapLike; }
}

export function useLiquidReaction(svgRef: RefObject<SVGSVGElement | null>, reaction: MascotReaction | null) {
  useEffect(() => {
    const svg = svgRef.current;
    const gsap = window.gsap;
    if (!svg || !gsap || !reaction || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const body = svg.querySelector(".liquid-body-motion");
    const tip = svg.querySelector(".liquid-tip-motion");
    const leftArm = svg.querySelector(".liquid-arm-left-motion");
    const rightArm = svg.querySelector(".liquid-arm-right-motion");
    const leftLeg = svg.querySelector(".liquid-leg-left-motion");
    const rightLeg = svg.querySelector(".liquid-leg-right-motion");
    const burst = svg.querySelectorAll(".liquid-burst-particle");
    const targets = [body, tip, leftArm, rightArm, leftLeg, rightLeg, ...burst].filter(Boolean);

    const reset = () => gsap.set(targets, { clearProps: "transform,opacity,visibility" });
    reset();
    const timeline = gsap.timeline({ onComplete: reset });

    if (reaction === "habit-done") {
      timeline
        .to(body, { y: -11, scaleX: 1.08, scaleY: .9, duration: .16, ease: "power2.out" })
        .to(tip, { rotation: 10, transformOrigin: "bottom center", duration: .18 }, 0)
        .to([leftArm, rightArm], { rotation: (index: number) => index ? -16 : 16, duration: .18 }, 0)
        .fromTo(burst, { opacity: 0, scale: .2 }, { opacity: .9, scale: 1, stagger: .025, duration: .2 }, .04)
        .to(body, { y: 0, scaleX: 1, scaleY: 1, duration: .34, ease: "elastic.out(1,.5)" }, .18)
        .to([tip, leftArm, rightArm], { rotation: 0, duration: .26 }, .2)
        .to(burst, { opacity: 0, y: 9, duration: .28, stagger: .02 }, .24);
    } else if (reaction === "perfect-day") {
      timeline
        .to(body, { y: -24, scaleX: 1.14, scaleY: .84, rotation: -3, duration: .22, ease: "power3.out" })
        .to(tip, { rotation: 22, scaleY: 1.16, transformOrigin: "bottom center", duration: .22 }, 0)
        .to([leftArm, rightArm], { rotation: (index: number) => index ? -42 : 42, duration: .22 }, 0)
        .to([leftLeg, rightLeg], { rotation: (index: number) => index ? -12 : 12, duration: .22 }, 0)
        .fromTo(burst, { opacity: 0, scale: .05 }, { opacity: 1, scale: 1.3, stagger: .03, duration: .24 }, .03)
        .to(body, { y: 0, scaleX: 1, scaleY: 1, rotation: 0, duration: .48, ease: "elastic.out(1,.42)" }, .25)
        .to([tip, leftArm, rightArm, leftLeg, rightLeg], { rotation: 0, scaleY: 1, duration: .36 }, .3)
        .to(burst, { opacity: 0, y: 14, rotation: 90, duration: .38, stagger: .02 }, .3);
    } else {
      timeline
        .to(body, { rotation: 5, x: 4, scaleX: .94, scaleY: 1.06, duration: .1 })
        .to(body, { rotation: -5, x: -4, scaleX: 1.06, scaleY: .94, duration: .1, repeat: 4, yoyo: true })
        .to(tip, { rotation: 18, duration: .12, repeat: 3, yoyo: true }, 0)
        .fromTo(burst, { opacity: 0, scale: .2 }, { opacity: .95, scale: 1, stagger: .02, duration: .2 }, 0)
        .to(body, { rotation: 0, x: 0, scaleX: 1, scaleY: 1, duration: .2 })
        .to(tip, { rotation: 0, duration: .2 }, "<")
        .to(burst, { opacity: 0, y: 10, duration: .3 }, .35);
    }

    return () => {
      timeline.kill();
      gsap.killTweensOf(targets);
      reset();
    };
  }, [reaction, svgRef]);
}
