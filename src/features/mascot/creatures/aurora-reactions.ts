import type { MascotReaction } from "../mascot.types";

import { gsap, type GsapReactionDefinition } from "../gsap-runtime";

const transformTargets = [
  ".aurora-body-motion",
  ".aurora-head-motion",
  ".aurora-arm-left-motion",
  ".aurora-arm-right-motion",
  ".aurora-leg-left-motion",
  ".aurora-leg-right-motion",
  ".aurora-halo-motion",
  ".aurora-face-motion",
].join(",");

function reset(root: SVGSVGElement) {
  gsap.set(root.querySelectorAll(transformTargets), { clearProps: "transform,opacity" });
  gsap.set(root.querySelectorAll(".aurora-burst-particle"), { opacity: 0, clearProps: "transform" });
}

function playReaction(root: SVGSVGElement, reaction: MascotReaction) {
  const body = root.querySelector(".aurora-body-motion");
  const head = root.querySelector(".aurora-head-motion");
  const leftArm = root.querySelector(".aurora-arm-left-motion");
  const rightArm = root.querySelector(".aurora-arm-right-motion");
  const leftLeg = root.querySelector(".aurora-leg-left-motion");
  const rightLeg = root.querySelector(".aurora-leg-right-motion");
  const halo = root.querySelector(".aurora-halo-motion");
  const face = root.querySelector(".aurora-face-motion");
  const particles = root.querySelectorAll(".aurora-burst-particle");
  const animated = root.querySelectorAll("[data-gsap]");

  gsap.killTweensOf(animated);
  reset(root);
  gsap.set([body, head, halo, face], { transformOrigin: "50% 50%" });
  gsap.set([leftArm, rightArm], { transformOrigin: "50% 10%" });
  gsap.set([leftLeg, rightLeg], { transformOrigin: "50% 5%" });
  gsap.set(particles, { transformOrigin: "50% 50%", opacity: 0, scale: 0.25 });

  const timeline = gsap.timeline({
    defaults: { overwrite: "auto" },
    onComplete: () => reset(root),
  });

  if (reaction === "habit-done") {
    return timeline
      .to(body, { y: -10, scaleX: 1.08, scaleY: 0.92, duration: 0.18, ease: "power2.out" })
      .to(head, { rotation: -7, duration: 0.18 }, "<")
      .to(rightArm, { rotation: -35, duration: 0.22, ease: "back.out(2)" }, "<")
      .to(halo, { scale: 1.18, duration: 0.22, yoyo: true, repeat: 1 }, "<")
      .fromTo(particles, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, y: -8, duration: 0.3, stagger: 0.03 }, "<0.05")
      .to([body, head, rightArm], { y: 0, rotation: 0, scale: 1, duration: 0.3, ease: "back.out(2)" })
      .to(particles, { opacity: 0, scale: 0.4, duration: 0.16 }, "-=0.2");
  }

  if (reaction === "perfect-day") {
    return timeline
      .to(body, { y: -24, scale: 1.1, duration: 0.28, ease: "power3.out" })
      .to(head, { y: -6, scale: 1.06, duration: 0.25 }, "<")
      .to(leftArm, { rotation: -60, y: -5, duration: 0.3, ease: "back.out(2)" }, "<")
      .to(rightArm, { rotation: 60, y: -5, duration: 0.3, ease: "back.out(2)" }, "<")
      .to(leftLeg, { rotation: -16, duration: 0.25 }, "<")
      .to(rightLeg, { rotation: 16, duration: 0.25 }, "<")
      .to(halo, { scale: 1.45, rotation: 22, duration: 0.42, ease: "power2.out" }, "<")
      .fromTo(particles, { opacity: 0, scale: 0.15, y: 10 }, { opacity: 1, scale: 1.35, y: -12, rotation: 45, duration: 0.48, stagger: 0.035, ease: "back.out(3)" }, "<0.05")
      .to(face, { scale: 1.1, duration: 0.18, yoyo: true, repeat: 1 }, "<")
      .to([body, head, leftArm, rightArm, leftLeg, rightLeg, halo], { y: 0, rotation: 0, scale: 1, duration: 0.38, ease: "elastic.out(1, .55)" })
      .to(particles, { opacity: 0, scale: 0.35, duration: 0.2 }, "-=0.28");
  }

  return timeline
    .to(halo, { scale: 1.5, rotation: 35, duration: 0.3, ease: "power2.out" })
    .to(body, { rotation: -9, y: -12, duration: 0.24 }, "<")
    .to(head, { rotation: 8, duration: 0.24 }, "<")
    .to(leftArm, { rotation: -48, duration: 0.25, ease: "back.out(2)" }, "<")
    .to(rightArm, { rotation: 48, duration: 0.25, ease: "back.out(2)" }, "<")
    .fromTo(particles, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1.2, rotation: 50, duration: 0.42, stagger: 0.03 }, "<0.04")
    .to(body, { rotation: 9, duration: 0.2 })
    .to([body, head, leftArm, rightArm, halo], { y: 0, rotation: 0, scale: 1, duration: 0.34, ease: "back.out(2)" })
    .to(particles, { opacity: 0, scale: 0.4, duration: 0.18 }, "-=0.22");
}


export const auroraReactions = { play: playReaction, reset: reset } satisfies GsapReactionDefinition;
