import type { MascotReaction } from "../mascot.types";
import { gsap, type GsapReactionDefinition } from "../gsap-runtime";

function reset(svg: SVGSVGElement) {
  gsap.set(svg.querySelectorAll<SVGElement>("[data-gsap]"), { clearProps: "transform,opacity,visibility" });
  gsap.set(svg.querySelectorAll<SVGElement>(".brutalist-dust-particle"), {
    clearProps: "transform,opacity,visibility", opacity: 0,
  });
}

function playReaction(svg: SVGSVGElement, reaction: MascotReaction) {
    const body = svg.querySelector(".brutalist-body-motion");
    const leftArm = svg.querySelector(".brutalist-arm-left-motion");
    const rightArm = svg.querySelector(".brutalist-arm-right-motion");
    const leftLeg = svg.querySelector(".brutalist-leg-left-motion");
    const rightLeg = svg.querySelector(".brutalist-leg-right-motion");
    const dust = svg.querySelectorAll(".brutalist-dust-particle");
    const targets = [body, leftArm, rightArm, leftLeg, rightLeg, ...dust].filter(Boolean);

    gsap.killTweensOf(targets);


    reset(svg);
    const timeline = gsap.timeline({ onComplete: () => reset(svg) });

    if (reaction === "habit-done") {
      timeline
        .to(body, { y: -10, scaleX: 1.04, scaleY: .94, duration: .16, ease: "power2.out" })
        .to(body, { y: 0, scaleX: 1, scaleY: 1, duration: .28, ease: "bounce.out" })
        .to(rightArm, { rotation: -18, transformOrigin: "top center", duration: .18 }, 0)
        .to(rightArm, { rotation: 0, duration: .25 }, .22)
        .fromTo(dust, { opacity: 0, scale: .2 }, { opacity: .8, scale: 1, stagger: .025, duration: .18 }, .05)
        .to(dust, { opacity: 0, y: 8, duration: .3, stagger: .02 }, .22);
    } else if (reaction === "perfect-day") {
      timeline
        .to(body, { y: -22, rotation: -2, scaleX: 1.08, scaleY: .9, duration: .22, ease: "power3.out" })
        .to([leftArm, rightArm], { rotation: (index: number) => index ? -28 : 28, transformOrigin: "top center", duration: .22 }, 0)
        .to([leftLeg, rightLeg], { rotation: (index: number) => index ? -10 : 10, transformOrigin: "top center", duration: .22 }, 0)
        .fromTo(dust, { opacity: 0, scale: .1 }, { opacity: 1, scale: 1.25, stagger: .03, duration: .22 }, .04)
        .to(body, { y: 0, rotation: 0, scaleX: 1, scaleY: 1, duration: .45, ease: "bounce.out" }, .28)
        .to([leftArm, rightArm, leftLeg, rightLeg], { rotation: 0, duration: .35 }, .32)
        .to(dust, { opacity: 0, y: 12, duration: .35, stagger: .02 }, .3);
    } else {
      timeline
        .to(body, { rotation: 3, x: 3, duration: .1 })
        .to(body, { rotation: -3, x: -3, duration: .1, repeat: 4, yoyo: true })
        .to(body, { rotation: 0, x: 0, duration: .18 })
        .fromTo(dust, { opacity: 0, scale: .2 }, { opacity: .9, scale: 1, stagger: .02, duration: .2 }, 0)
        .to(dust, { opacity: 0, y: 9, duration: .3 }, .35);
    }

    return timeline;

}

export const brutalistReactions = { play: playReaction, reset } satisfies GsapReactionDefinition;
