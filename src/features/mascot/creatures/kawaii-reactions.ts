import type { MascotReaction } from "../mascot.types";

import { gsap, type GsapReactionDefinition } from "../gsap-runtime";

const selector = [
  ".kawaii-body-motion",
  ".kawaii-ear-left-motion",
  ".kawaii-ear-right-motion",
  ".kawaii-arm-left-motion",
  ".kawaii-arm-right-motion",
  ".kawaii-leg-left-motion",
  ".kawaii-leg-right-motion",
  ".kawaii-face-motion",
].join(",");

function reset(root: SVGSVGElement) {
  gsap.set(root.querySelectorAll<SVGElement>(selector), { clearProps: "transform,opacity" });
  gsap.set(root.querySelectorAll<SVGElement>(".kawaii-burst-particle"), { opacity: 0, clearProps: "transform" });
}

function playReaction(root: SVGSVGElement, reaction: MascotReaction) {
  const body = root.querySelector<SVGElement>(".kawaii-body-motion");
  const leftEar = root.querySelector<SVGElement>(".kawaii-ear-left-motion");
  const rightEar = root.querySelector<SVGElement>(".kawaii-ear-right-motion");
  const leftArm = root.querySelector<SVGElement>(".kawaii-arm-left-motion");
  const rightArm = root.querySelector<SVGElement>(".kawaii-arm-right-motion");
  const leftLeg = root.querySelector<SVGElement>(".kawaii-leg-left-motion");
  const rightLeg = root.querySelector<SVGElement>(".kawaii-leg-right-motion");
  const face = root.querySelector<SVGElement>(".kawaii-face-motion");
  const particles = Array.from(root.querySelectorAll<SVGElement>(".kawaii-burst-particle"));
  const parts = root.querySelectorAll<SVGElement>("[data-gsap]");

  gsap.killTweensOf(parts);
  reset(root);
  gsap.set(body, { transformOrigin: "50% 70%" });
  gsap.set([leftEar, rightEar], { transformOrigin: "50% 85%" });
  gsap.set([leftArm, rightArm], { transformOrigin: "50% 12%" });
  gsap.set([leftLeg, rightLeg], { transformOrigin: "50% 8%" });
  gsap.set(face, { transformOrigin: "50% 50%" });
  gsap.set(particles, { opacity: 0, scale: 0.35, transformOrigin: "50% 50%" });

  const tl = gsap.timeline({ defaults: { overwrite: "auto" }, onComplete: () => reset(root) });

  if (reaction === "habit-done") {
    return tl
      .to(body, { y: -10, scaleX: 1.05, scaleY: 0.94, duration: 0.18, ease: "power2.out" })
      .to(rightArm, { rotation: -28, y: -2, duration: 0.2, ease: "back.out(2.2)" }, "<")
      .to([leftEar, rightEar], { rotation: (index: number) => index ? -7 : 7, duration: 0.18 }, "<")
      .fromTo(particles, { opacity: 0, scale: 0.25, y: 3 }, { opacity: 1, scale: 1, y: -5, duration: 0.28, stagger: 0.03, ease: "back.out(2.6)" }, "<0.04")
      .to([body, rightArm, leftEar, rightEar], { y: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1, duration: 0.28, ease: "back.out(2)" })
      .to(particles, { opacity: 0, scale: 0.5, duration: 0.16 }, "-=0.2");
  }

  if (reaction === "perfect-day") {
    return tl
      .to(body, { y: -22, scale: 1.08, duration: 0.26, ease: "power3.out" })
      .to(leftArm, { rotation: 46, y: -5, duration: 0.28, ease: "back.out(2.5)" }, "<")
      .to(rightArm, { rotation: -46, y: -5, duration: 0.28, ease: "back.out(2.5)" }, "<")
      .to([leftEar, rightEar], { scale: 1.08, duration: 0.22 }, "<")
      .to([leftLeg, rightLeg], { rotation: (index: number) => index ? -12 : 12, duration: 0.24 }, "<")
      .fromTo(particles, { opacity: 0, scale: 0.18, y: 8 }, { opacity: 1, scale: 1.35, y: -10, rotation: 32, duration: 0.42, stagger: 0.035, ease: "back.out(3)" }, "<0.05")
      .to(face, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1 }, "<")
      .to([body, leftArm, rightArm, leftEar, rightEar, leftLeg, rightLeg], { y: 0, rotation: 0, scale: 1, duration: 0.36, ease: "elastic.out(1,.55)" })
      .to(particles, { opacity: 0, scale: 0.45, duration: 0.2 }, "-=0.28");
  }

  return tl
    .to(body, { rotation: -7, y: -8, duration: 0.2, ease: "power2.out" })
    .to(leftArm, { rotation: 30, duration: 0.2 }, "<")
    .to(rightArm, { rotation: -34, duration: 0.2 }, "<")
    .to([leftEar, rightEar], { rotation: (index: number) => index ? -10 : 10, duration: 0.2 }, "<")
    .fromTo(particles, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1.15, rotation: 24, duration: 0.34, stagger: 0.03, ease: "back.out(2.8)" }, "<0.04")
    .to(body, { rotation: 7, duration: 0.18, ease: "sine.inOut" })
    .to(body, { rotation: -3, duration: 0.15, ease: "sine.inOut" })
    .to([body, leftArm, rightArm, leftEar, rightEar], { y: 0, rotation: 0, scale: 1, duration: 0.32, ease: "back.out(2)" })
    .to(particles, { opacity: 0, scale: 0.45, duration: 0.18 }, "-=0.22");
}


export const kawaiiReactions = { play: playReaction, reset: reset } satisfies GsapReactionDefinition;
