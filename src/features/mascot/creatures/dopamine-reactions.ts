import type { MascotReaction } from "../mascot.types";

import { gsap, type GsapReactionDefinition } from "../gsap-runtime";

const transformTargets = [
  ".dopamine-body-motion",
  ".dopamine-arm-left-motion",
  ".dopamine-arm-right-motion",
  ".dopamine-leg-left-motion",
  ".dopamine-leg-right-motion",
  ".dopamine-tuft-motion",
  ".dopamine-face-motion",
  ".dopamine-sprinkle-burst",
].join(",");

function resetAnimatedParts(root: SVGSVGElement) {
  gsap.set(root.querySelectorAll<SVGElement>(transformTargets), {
    clearProps: "transform,opacity",
  });
  gsap.set(root.querySelectorAll<SVGElement>(".dopamine-burst-particle"), {
    opacity: 0,
    clearProps: "transform",
  });
}

function playReaction(root: SVGSVGElement, reaction: MascotReaction) {
  const body = root.querySelector<SVGElement>(".dopamine-body-motion");
  const leftArm = root.querySelector<SVGElement>(".dopamine-arm-left-motion");
  const rightArm = root.querySelector<SVGElement>(".dopamine-arm-right-motion");
  const leftLeg = root.querySelector<SVGElement>(".dopamine-leg-left-motion");
  const rightLeg = root.querySelector<SVGElement>(".dopamine-leg-right-motion");
  const tuft = root.querySelector<SVGElement>(".dopamine-tuft-motion");
  const face = root.querySelector<SVGElement>(".dopamine-face-motion");
  const burst = root.querySelector<SVGElement>(".dopamine-sprinkle-burst");
  const particles = Array.from(
    root.querySelectorAll<SVGElement>(".dopamine-burst-particle"),
  );
  const animated = root.querySelectorAll<SVGElement>("[data-gsap]");

  gsap.killTweensOf(animated);
  resetAnimatedParts(root);
  gsap.set(body, { transformOrigin: "50% 72%" });
  gsap.set(leftArm, { transformOrigin: "86% 18%" });
  gsap.set(rightArm, { transformOrigin: "14% 18%" });
  gsap.set([leftLeg, rightLeg], { transformOrigin: "50% 0%" });
  gsap.set(tuft, { transformOrigin: "50% 100%" });
  gsap.set(face, { transformOrigin: "50% 55%" });
  gsap.set(burst, { transformOrigin: "50% 50%" });
  gsap.set(particles, { opacity: 0, scale: 0.25, transformOrigin: "50% 50%" });

  const timeline = gsap.timeline({
    defaults: { overwrite: "auto" },
    onComplete: () => resetAnimatedParts(root),
  });

  if (reaction === "habit-done") {
    return timeline
      .to(body, {
        y: -11,
        scaleX: 1.06,
        scaleY: 0.92,
        duration: 0.18,
        ease: "power2.out",
      })
      .to(rightArm, { rotation: -28, duration: 0.2, ease: "back.out(2)" }, "<")
      .to(leftArm, { rotation: 12, duration: 0.2, ease: "back.out(2)" }, "<")
      .to(tuft, { rotation: -9, scaleY: 1.08, duration: 0.2 }, "<")
      .fromTo(
        particles.slice(0, 5),
        { opacity: 0, y: 4, scale: 0.2 },
        {
          opacity: 1,
          y: -6,
          scale: 1,
          rotation: 35,
          stagger: 0.035,
          duration: 0.28,
          ease: "back.out(2.5)",
        },
        "<0.04",
      )
      .to(body, { y: 2, scaleX: 0.98, scaleY: 1.04, duration: 0.18 })
      .to(
        [body, leftArm, rightArm, tuft],
        {
          y: 0,
          rotation: 0,
          scale: 1,
          scaleX: 1,
          scaleY: 1,
          duration: 0.28,
          ease: "back.out(2.2)",
        },
        "<",
      )
      .to(particles, { opacity: 0, scale: 0.4, duration: 0.15 }, "-=0.18");
  }

  if (reaction === "perfect-day") {
    return timeline
      .to(body, {
        y: -24,
        scale: 1.08,
        rotation: -4,
        duration: 0.27,
        ease: "power3.out",
      })
      .to(leftArm, { rotation: -72, y: -5, duration: 0.3, ease: "back.out(2.4)" }, "<")
      .to(rightArm, { rotation: 72, y: -5, duration: 0.3, ease: "back.out(2.4)" }, "<")
      .to(leftLeg, { rotation: 13, y: -3, duration: 0.25 }, "<")
      .to(rightLeg, { rotation: -13, y: -3, duration: 0.25 }, "<")
      .to(tuft, { rotation: 10, scaleY: 1.16, duration: 0.25 }, "<")
      .fromTo(
        particles,
        { opacity: 0, scale: 0.15, y: 10 },
        {
          opacity: 1,
          scale: 1.25,
          y: -12,
          rotation: 55,
          stagger: 0.03,
          duration: 0.42,
          ease: "back.out(3)",
        },
        "<0.06",
      )
      .to(face, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1 }, "<")
      .to(body, { y: 3, rotation: 3, scale: 0.98, duration: 0.3, ease: "power2.in" })
      .to(
        [body, leftArm, rightArm, leftLeg, rightLeg, tuft],
        {
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 0.38,
          ease: "elastic.out(1, 0.55)",
        },
      )
      .to(particles, { opacity: 0, scale: 0.35, duration: 0.2 }, "-=0.3");
  }

  return timeline
    .to(body, { y: -13, rotation: -8, scale: 1.04, duration: 0.22, ease: "power2.out" })
    .to(leftArm, { rotation: -54, duration: 0.24, ease: "back.out(2)" }, "<")
    .to(rightArm, { rotation: 42, duration: 0.24, ease: "back.out(2)" }, "<")
    .to(tuft, { rotation: -13, scaleY: 1.14, duration: 0.24 }, "<")
    .fromTo(
      particles,
      { opacity: 0, scale: 0.2, rotation: -25 },
      {
        opacity: 1,
        scale: 1.1,
        rotation: 30,
        stagger: 0.025,
        duration: 0.36,
        ease: "back.out(2.7)",
      },
      "<0.05",
    )
    .to(body, { rotation: 8, duration: 0.18, ease: "sine.inOut" })
    .to(body, { rotation: -3, duration: 0.15, ease: "sine.inOut" })
    .to(
      [body, leftArm, rightArm, tuft],
      { y: 0, rotation: 0, scale: 1, duration: 0.34, ease: "back.out(2.2)" },
    )
    .to(particles, { opacity: 0, scale: 0.4, duration: 0.18 }, "-=0.22");
}


export const dopamineReactions = { play: playReaction, reset: resetAnimatedParts } satisfies GsapReactionDefinition;
