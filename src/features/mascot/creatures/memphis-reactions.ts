import type { MascotReaction } from "../mascot.types";

import { gsap, type GsapReactionDefinition } from "../gsap-runtime";

const transformTargetSelector = [
  ".memphis-body-motion",
  ".memphis-head-motion",
  ".memphis-arm-left-motion",
  ".memphis-arm-right-motion",
  ".memphis-leg-left-motion",
  ".memphis-leg-right-motion",
  ".memphis-glove-motion",
  ".memphis-face-motion",
].join(",");

function resetAnimatedParts(root: SVGSVGElement) {
  const transformTargets = root.querySelectorAll<SVGElement>(
    transformTargetSelector,
  );
  const particles = root.querySelectorAll<SVGElement>(
    ".memphis-burst-particle",
  );

  gsap.set(transformTargets, { clearProps: "transform" });
  gsap.set(particles, { opacity: 0, clearProps: "transform" });
}

function playReaction(root: SVGSVGElement, reaction: MascotReaction) {
  const body = root.querySelector<SVGElement>(".memphis-body-motion");
  const head = root.querySelector<SVGElement>(".memphis-head-motion");
  const leftArm = root.querySelector<SVGElement>(".memphis-arm-left-motion");
  const rightArm = root.querySelector<SVGElement>(".memphis-arm-right-motion");
  const leftLeg = root.querySelector<SVGElement>(".memphis-leg-left-motion");
  const rightLeg = root.querySelector<SVGElement>(".memphis-leg-right-motion");
  const glove = root.querySelector<SVGElement>(".memphis-glove-motion");
  const face = root.querySelector<SVGElement>(".memphis-face-motion");
  const particles = Array.from(
    root.querySelectorAll<SVGElement>(".memphis-burst-particle"),
  );
  const animatedParts = root.querySelectorAll<SVGElement>("[data-gsap]");

  gsap.killTweensOf(animatedParts);
  resetAnimatedParts(root);
  gsap.set(body, { transformOrigin: "50% 50%" });
  gsap.set(head, { transformOrigin: "50% 82%" });
  gsap.set(leftArm, { transformOrigin: "88% 16%" });
  gsap.set(rightArm, { transformOrigin: "12% 82%" });
  gsap.set([leftLeg, rightLeg], { transformOrigin: "50% 8%" });
  gsap.set(glove, { transformOrigin: "50% 82%" });
  gsap.set(face, { transformOrigin: "50% 50%" });
  gsap.set(particles, {
    opacity: 0,
    scale: 0.35,
    transformOrigin: "50% 50%",
  });

  const timeline = gsap.timeline({
    defaults: { overwrite: "auto" },
    onComplete: () => resetAnimatedParts(root),
  });

  if (reaction === "habit-done") {
    return timeline
      .to(body, {
        y: -10,
        scaleX: 1.04,
        scaleY: 0.95,
        duration: 0.18,
        ease: "power2.out",
      })
      .to(head, { rotation: -7, duration: 0.2, ease: "back.out(2)" }, "<")
      .to(rightArm, { rotation: -24, duration: 0.2, ease: "back.out(2.2)" }, "<")
      .to(glove, { rotation: 14, scale: 1.06, duration: 0.18 }, "<")
      .fromTo(
        particles.slice(0, 5),
        { opacity: 0, scale: 0.25, y: 5 },
        {
          opacity: 1,
          scale: 1,
          y: -5,
          duration: 0.28,
          stagger: 0.035,
          ease: "back.out(2.5)",
        },
        "<0.04",
      )
      .to(body, { y: 2, scaleX: 0.98, scaleY: 1.03, duration: 0.17 })
      .to(
        [body, head, rightArm, glove],
        {
          y: 0,
          rotation: 0,
          scale: 1,
          scaleX: 1,
          scaleY: 1,
          duration: 0.25,
          ease: "back.out(2)",
        },
      )
      .to(particles, { opacity: 0, scale: 0.5, duration: 0.15 }, "-=0.18");
  }

  if (reaction === "perfect-day") {
    return timeline
      .to(body, {
        y: -24,
        scale: 1.07,
        duration: 0.28,
        ease: "power3.out",
      })
      .to(head, { y: -5, rotation: -10, duration: 0.28, ease: "back.out(2)" }, "<")
      .to(leftArm, { rotation: 34, y: -4, duration: 0.3, ease: "back.out(2)" }, "<")
      .to(rightArm, { rotation: -48, y: -6, duration: 0.3, ease: "back.out(2)" }, "<")
      .to(leftLeg, { rotation: -9, duration: 0.25 }, "<")
      .to(rightLeg, { rotation: 9, duration: 0.25 }, "<")
      .to(glove, { rotation: 22, scale: 1.12, duration: 0.25 }, "<")
      .fromTo(
        particles,
        { opacity: 0, scale: 0.18, y: 10, rotation: -24 },
        {
          opacity: 1,
          scale: 1.25,
          y: -10,
          rotation: 30,
          duration: 0.42,
          stagger: 0.035,
          ease: "back.out(3)",
        },
        "<0.05",
      )
      .to(face, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1 }, "<")
      .to(body, { y: 3, scale: 0.98, duration: 0.27, ease: "power2.in" })
      .to(
        [body, head, leftArm, rightArm, leftLeg, rightLeg, glove],
        {
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 0.34,
          ease: "elastic.out(1, 0.55)",
        },
      )
      .to(particles, { opacity: 0, scale: 0.4, duration: 0.2 }, "-=0.3");
  }

  return timeline
    .to(head, { rotation: -13, y: -5, duration: 0.22, ease: "power2.out" })
    .to(body, { rotation: 5, y: -11, duration: 0.23, ease: "power2.out" }, "<")
    .to(leftArm, { rotation: 26, duration: 0.24, ease: "back.out(2)" }, "<")
    .to(rightArm, { rotation: -36, duration: 0.24, ease: "back.out(2)" }, "<")
    .to(glove, { rotation: 18, scale: 1.08, duration: 0.2 }, "<")
    .fromTo(
      particles,
      { opacity: 0, scale: 0.2, rotation: -30 },
      {
        opacity: 1,
        scale: 1.15,
        rotation: 35,
        duration: 0.36,
        stagger: 0.03,
        ease: "back.out(2.6)",
      },
      "<0.04",
    )
    .to(body, { rotation: -5, duration: 0.19, ease: "sine.inOut" })
    .to(body, { rotation: 2, duration: 0.15, ease: "sine.inOut" })
    .to(
      [body, head, leftArm, rightArm, glove],
      {
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 0.32,
        ease: "back.out(2)",
      },
    )
    .to(particles, { opacity: 0, scale: 0.45, duration: 0.18 }, "-=0.24");
}


export const memphisReactions = { play: playReaction, reset: resetAnimatedParts } satisfies GsapReactionDefinition;
