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
declare global { interface Window { gsap?: GsapLike; } }

export function useComicReaction(svgRef: RefObject<SVGSVGElement | null>, reaction: MascotReaction | null) {
  useEffect(() => {
    const svg = svgRef.current;
    const gsap = window.gsap;
    if (!svg || !gsap || !reaction || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const body = svg.querySelector(".comic-body-motion");
    const head = svg.querySelector(".comic-head-motion");
    const cape = svg.querySelector(".comic-cape-motion");
    const leftArm = svg.querySelector(".comic-arm-left-motion");
    const rightArm = svg.querySelector(".comic-arm-right-motion");
    const leftLeg = svg.querySelector(".comic-leg-left-motion");
    const rightLeg = svg.querySelector(".comic-leg-right-motion");
    const star = svg.querySelector(".comic-star-motion");
    const burst = svg.querySelectorAll(".comic-burst-particle");
    const targets = [body, head, cape, leftArm, rightArm, leftLeg, rightLeg, star, ...burst].filter(Boolean);
    const reset = () => gsap.set(targets, { clearProps: "transform,opacity,visibility" });

    reset();
    const timeline = gsap.timeline({ onComplete: reset });
    if (reaction === "habit-done") {
      timeline
        .to(body, { y: -12, scaleX: 1.05, scaleY: .95, duration: .16, ease: "power2.out" })
        .to(body, { y: 0, scaleX: 1, scaleY: 1, duration: .28, ease: "back.out(2)" })
        .to(rightArm, { rotation: -32, transformOrigin: "top center", duration: .18 }, 0)
        .to(rightArm, { rotation: 0, duration: .24 }, .2)
        .to(cape, { rotation: 12, transformOrigin: "right top", duration: .2 }, 0)
        .to(cape, { rotation: 0, duration: .3 }, .22)
        .fromTo(burst, { opacity: 0, scale: .2 }, { opacity: 1, scale: 1, stagger: .025, duration: .18 }, .04)
        .to(burst, { opacity: 0, y: -8, duration: .28, stagger: .02 }, .24);
    } else if (reaction === "perfect-day") {
      timeline
        .to(body, { y: -25, scaleX: 1.08, scaleY: .9, duration: .22, ease: "power3.out" })
        .to(head, { rotation: -6, transformOrigin: "center bottom", duration: .22 }, 0)
        .to([leftArm, rightArm], { rotation: (i: number) => i ? -42 : 42, transformOrigin: "top center", duration: .22 }, 0)
        .to([leftLeg, rightLeg], { rotation: (i: number) => i ? -12 : 12, transformOrigin: "top center", duration: .22 }, 0)
        .to(cape, { rotation: 18, scaleX: 1.12, transformOrigin: "right top", duration: .25 }, 0)
        .to(star, { rotation: 180, scale: 1.35, transformOrigin: "center", duration: .4 }, 0)
        .fromTo(burst, { opacity: 0, scale: .1 }, { opacity: 1, scale: 1.3, stagger: .03, duration: .22 }, .04)
        .to(body, { y: 0, scaleX: 1, scaleY: 1, duration: .45, ease: "bounce.out" }, .28)
        .to([head, leftArm, rightArm, leftLeg, rightLeg, cape, star], { rotation: 0, scale: 1, duration: .35 }, .3)
        .to(burst, { opacity: 0, y: -14, duration: .34, stagger: .02 }, .3);
    } else {
      timeline
        .to(body, { rotation: 4, x: 3, duration: .09 })
        .to(body, { rotation: -4, x: -3, duration: .09, repeat: 5, yoyo: true })
        .to(body, { rotation: 0, x: 0, duration: .16 })
        .to(cape, { rotation: 20, transformOrigin: "right top", duration: .18 }, 0)
        .to(cape, { rotation: 0, duration: .3 }, .5)
        .fromTo(burst, { opacity: 0, scale: .2 }, { opacity: 1, scale: 1, stagger: .02, duration: .18 }, 0)
        .to(burst, { opacity: 0, y: -10, duration: .3 }, .4);
    }

    return () => {
      timeline.kill();
      gsap.killTweensOf(targets);
      reset();
    };
  }, [reaction, svgRef]);
}
