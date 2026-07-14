import type { MascotReaction } from "../mascot.types";

import { gsap, type GsapReactionDefinition } from "../gsap-runtime";

const animatedSelector = [
  ".cosmic-body-motion",
  ".cosmic-ring-motion",
  ".cosmic-arm-left-motion",
  ".cosmic-arm-right-motion",
  ".cosmic-leg-left-motion",
  ".cosmic-leg-right-motion",
  ".cosmic-face-motion",
].join(",");

function reset(root: SVGSVGElement) {
  gsap.set(root.querySelectorAll<SVGElement>(animatedSelector), { clearProps: "transform,opacity" });
  gsap.set(root.querySelectorAll<SVGElement>(".cosmic-particle"), { opacity: 0, clearProps: "transform" });
}

function playReaction(root: SVGSVGElement, reaction: MascotReaction) {
  const body = root.querySelector<SVGElement>(".cosmic-body-motion");
  const ring = root.querySelector<SVGElement>(".cosmic-ring-motion");
  const leftArm = root.querySelector<SVGElement>(".cosmic-arm-left-motion");
  const rightArm = root.querySelector<SVGElement>(".cosmic-arm-right-motion");
  const leftLeg = root.querySelector<SVGElement>(".cosmic-leg-left-motion");
  const rightLeg = root.querySelector<SVGElement>(".cosmic-leg-right-motion");
  const face = root.querySelector<SVGElement>(".cosmic-face-motion");
  const particles = Array.from(root.querySelectorAll<SVGElement>(".cosmic-particle"));
  const animated = root.querySelectorAll<SVGElement>("[data-gsap]");

  gsap.killTweensOf(animated);
  reset(root);
  gsap.set([body, ring, face], { transformOrigin: "50% 50%" });
  gsap.set([leftArm, rightArm], { transformOrigin: "50% 15%" });
  gsap.set([leftLeg, rightLeg], { transformOrigin: "50% 10%" });
  gsap.set(particles, { opacity: 0, scale: 0.3, transformOrigin: "50% 50%" });

  const tl = gsap.timeline({ defaults: { overwrite: "auto" }, onComplete: () => reset(root) });

  if (reaction === "habit-done") {
    return tl
      .to(body, { y: -12, scale: 1.05, duration: 0.18, ease: "power2.out" })
      .to(ring, { rotation: 14, scale: 1.05, duration: 0.22, ease: "power2.out" }, "<")
      .to(rightArm, { rotation: -32, duration: 0.2, ease: "back.out(2)" }, "<")
      .fromTo(particles, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1.1, duration: 0.28, stagger: 0.03, ease: "back.out(2.4)" }, "<0.03")
      .to([body, ring, rightArm], { y: 0, rotation: 0, scale: 1, duration: 0.32, ease: "back.out(2)" })
      .to(particles, { opacity: 0, scale: 0.4, duration: 0.16 }, "-=0.2");
  }

  if (reaction === "perfect-day") {
    return tl
      .to(body, { y: -24, scale: 1.1, duration: 0.28, ease: "power3.out" })
      .to(ring, { rotation: 360, scale: 1.18, duration: 0.7, ease: "power2.inOut" }, "<")
      .to(leftArm, { rotation: 48, y: -4, duration: 0.3, ease: "back.out(2)" }, "<")
      .to(rightArm, { rotation: -48, y: -4, duration: 0.3, ease: "back.out(2)" }, "<")
      .to([leftLeg, rightLeg], { rotation: 9, duration: 0.26 }, "<")
      .fromTo(particles, { opacity: 0, scale: 0.2, y: 8 }, { opacity: 1, scale: 1.4, y: -10, rotation: 40, duration: 0.45, stagger: 0.035, ease: "back.out(3)" }, "<0.05")
      .to(face, { scale: 1.1, duration: 0.18, yoyo: true, repeat: 1 }, "<")
      .to([body, ring, leftArm, rightArm, leftLeg, rightLeg], { y: 0, rotation: 0, scale: 1, duration: 0.38, ease: "elastic.out(1,.55)" })
      .to(particles, { opacity: 0, scale: 0.4, duration: 0.2 }, "-=0.28");
  }

  return tl
    .to(ring, { rotation: 180, scale: 1.12, duration: 0.42, ease: "power2.inOut" })
    .to(body, { rotation: -8, y: -10, duration: 0.22, ease: "power2.out" }, "<")
    .to(leftArm, { rotation: 38, duration: 0.22, ease: "back.out(2)" }, "<")
    .to(rightArm, { rotation: -38, duration: 0.22, ease: "back.out(2)" }, "<")
    .fromTo(particles, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1.2, duration: 0.35, stagger: 0.03, ease: "back.out(2.6)" }, "<0.04")
    .to(body, { rotation: 7, duration: 0.18, ease: "sine.inOut" })
    .to([body, ring, leftArm, rightArm], { y: 0, rotation: 0, scale: 1, duration: 0.34, ease: "back.out(2)" })
    .to(particles, { opacity: 0, scale: 0.4, duration: 0.18 }, "-=0.22");
}


export const cosmicReactions = { play: playReaction, reset: reset } satisfies GsapReactionDefinition;
