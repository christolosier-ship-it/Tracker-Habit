import type { MascotReaction } from "../mascot.types";
import { gsap, type GsapReactionDefinition } from "../gsap-runtime";

function reset(svg: SVGSVGElement) {
  gsap.set(svg.querySelectorAll<SVGElement>("[data-gsap]"), { clearProps: "transform,opacity,visibility" });
  gsap.set(svg.querySelectorAll<SVGElement>(".editorial-burst-particle"), {
    clearProps: "transform,opacity,visibility", opacity: 0,
  });
}

function playReaction(svg: SVGSVGElement, reaction: MascotReaction) {
    const body = svg.querySelector(".editorial-body-motion");
    const head = svg.querySelector(".editorial-head-motion");
    const tail = svg.querySelector(".editorial-tail-motion");
    const leftPaw = svg.querySelector(".editorial-paw-left-motion");
    const rightPaw = svg.querySelector(".editorial-paw-right-motion");
    const jewel = svg.querySelector(".editorial-jewel-motion");
    const particles = svg.querySelectorAll(".editorial-burst-particle");
    const targets = [body, head, tail, leftPaw, rightPaw, jewel, ...particles].filter(Boolean);

    gsap.killTweensOf(targets);

    reset(svg);
    const timeline = gsap.timeline({ onComplete: () => reset(svg) });

    if (reaction === "habit-done") {
      timeline
        .to(body, { y: -8, scaleX: 1.03, scaleY: .96, duration: .17, ease: "power2.out" })
        .to(head, { rotation: -5, transformOrigin: "center bottom", duration: .18 }, 0)
        .to(rightPaw, { rotation: -15, y: -4, transformOrigin: "top center", duration: .18 }, 0)
        .to(body, { y: 0, scaleX: 1, scaleY: 1, duration: .28, ease: "back.out(2)" })
        .to([head, rightPaw], { rotation: 0, y: 0, duration: .25 }, .2)
        .fromTo(particles, { opacity: 0, scale: .3 }, { opacity: .9, scale: 1, stagger: .025, duration: .18 }, .04)
        .to(particles, { opacity: 0, y: -8, duration: .28, stagger: .02 }, .22);
    } else if (reaction === "perfect-day") {
      timeline
        .to(body, { y: -20, scaleX: 1.07, scaleY: .91, duration: .22, ease: "power3.out" })
        .to(head, { rotation: 6, y: -4, transformOrigin: "center bottom", duration: .22 }, 0)
        .to([leftPaw, rightPaw], { y: -10, rotation: (i: number) => i ? -12 : 12, duration: .22 }, 0)
        .to(tail, { rotation: 22, transformOrigin: "left bottom", duration: .28 }, 0)
        .to(jewel, { scale: 1.35, rotation: 180, transformOrigin: "center", duration: .3 }, 0)
        .fromTo(particles, { opacity: 0, scale: .15 }, { opacity: 1, scale: 1.2, stagger: .03, duration: .22 }, .04)
        .to(body, { y: 0, scaleX: 1, scaleY: 1, duration: .42, ease: "bounce.out" }, .28)
        .to([head, leftPaw, rightPaw, tail, jewel], { rotation: 0, y: 0, scale: 1, duration: .35 }, .3)
        .to(particles, { opacity: 0, y: -14, duration: .34, stagger: .02 }, .32);
    } else {
      timeline
        .to(head, { rotation: -7, duration: .12 })
        .to(head, { rotation: 7, duration: .12, repeat: 3, yoyo: true })
        .to(head, { rotation: 0, duration: .18 })
        .to(tail, { rotation: 26, duration: .18 }, 0)
        .to(tail, { rotation: -12, duration: .18, repeat: 3, yoyo: true }, .12)
        .to(tail, { rotation: 0, duration: .2 }, .62)
        .fromTo(particles, { opacity: 0, scale: .2 }, { opacity: .95, scale: 1, stagger: .02, duration: .2 }, 0)
        .to(particles, { opacity: 0, y: -10, duration: .3 }, .45);
    }

    return timeline;

}

export const editorialReactions = { play: playReaction, reset } satisfies GsapReactionDefinition;
