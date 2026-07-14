import type { MascotReaction } from "../mascot.types";

import { gsap, type GsapReactionDefinition } from "../gsap-runtime";

const transformTargets = [
  ".tropical-body-motion",
  ".tropical-head-motion",
  ".tropical-beak-motion",
  ".tropical-wing-left-motion",
  ".tropical-wing-right-motion",
  ".tropical-leg-left-motion",
  ".tropical-leg-right-motion",
  ".tropical-garland-motion",
].join(",");

function reset(root: SVGSVGElement) {
  gsap.set(root.querySelectorAll<SVGElement>(transformTargets), {
    clearProps: "transform,opacity",
  });
  gsap.set(root.querySelectorAll<SVGElement>(".tropical-burst-particle"), {
    opacity: 0,
    clearProps: "transform",
  });
}

function playReaction(root: SVGSVGElement, reaction: MascotReaction) {
  const body = root.querySelector<SVGElement>(".tropical-body-motion");
  const head = root.querySelector<SVGElement>(".tropical-head-motion");
  const beak = root.querySelector<SVGElement>(".tropical-beak-motion");
  const leftWing = root.querySelector<SVGElement>(".tropical-wing-left-motion");
  const rightWing = root.querySelector<SVGElement>(".tropical-wing-right-motion");
  const leftLeg = root.querySelector<SVGElement>(".tropical-leg-left-motion");
  const rightLeg = root.querySelector<SVGElement>(".tropical-leg-right-motion");
  const garland = root.querySelector<SVGElement>(".tropical-garland-motion");
  const particles = Array.from(
    root.querySelectorAll<SVGElement>(".tropical-burst-particle"),
  );
  const animated = root.querySelectorAll<SVGElement>("[data-gsap]");

  gsap.killTweensOf(animated);
  reset(root);
  gsap.set(body, { transformOrigin: "50% 58%" });
  gsap.set(head, { transformOrigin: "47% 58%" });
  gsap.set(beak, { transformOrigin: "8% 58%" });
  gsap.set([leftWing, rightWing], { transformOrigin: "50% 12%" });
  gsap.set([leftLeg, rightLeg], { transformOrigin: "50% 0%" });
  gsap.set(garland, { transformOrigin: "50% 50%" });
  gsap.set(particles, { opacity: 0, scale: 0.35, transformOrigin: "50% 50%" });

  const timeline = gsap.timeline({
    defaults: { overwrite: "auto" },
    onComplete: () => reset(root),
  });

  if (reaction === "habit-done") {
    return timeline
      .to(body, { y: -10, scaleY: 1.06, duration: 0.18, ease: "power2.out" })
      .to(head, { rotation: -7, duration: 0.2 }, "<")
      .to(beak, { rotation: 7, duration: 0.18 }, "<")
      .to(rightWing, { rotation: -34, duration: 0.2, ease: "back.out(2)" }, "<")
      .fromTo(
        particles,
        { opacity: 0, scale: 0.25, y: 5 },
        { opacity: 1, scale: 1, y: -5, duration: 0.28, stagger: 0.03, ease: "back.out(2.4)" },
        "<0.03",
      )
      .to([body, head, beak, rightWing], {
        y: 0,
        rotation: 0,
        scale: 1,
        scaleY: 1,
        duration: 0.3,
        ease: "back.out(2)",
      })
      .to(particles, { opacity: 0, duration: 0.16 }, "-=0.2");
  }

  if (reaction === "perfect-day") {
    return timeline
      .to(body, { y: -24, scale: 1.08, duration: 0.28, ease: "power3.out" })
      .to(head, { rotation: -10, y: -3, duration: 0.26 }, "<")
      .to(beak, { rotation: 10, scaleX: 1.04, duration: 0.24 }, "<")
      .to(leftWing, { rotation: 44, x: -4, duration: 0.3, ease: "back.out(2)" }, "<")
      .to(rightWing, { rotation: -44, x: 4, duration: 0.3, ease: "back.out(2)" }, "<")
      .to([leftLeg, rightLeg], { rotation: 9, duration: 0.25 }, "<")
      .to(garland, { scale: 1.12, rotation: 4, duration: 0.22, yoyo: true, repeat: 1 }, "<")
      .fromTo(
        particles,
        { opacity: 0, scale: 0.2, y: 8 },
        { opacity: 1, scale: 1.35, y: -11, rotation: 45, duration: 0.42, stagger: 0.035, ease: "back.out(3)" },
        "<0.05",
      )
      .to(body, { y: 3, scale: 0.98, duration: 0.26, ease: "power2.in" })
      .to([body, head, beak, leftWing, rightWing, leftLeg, rightLeg, garland], {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 0.36,
        ease: "elastic.out(1, .55)",
      })
      .to(particles, { opacity: 0, duration: 0.2 }, "-=0.28");
  }

  return timeline
    .to(body, { rotation: -7, y: -10, duration: 0.2, ease: "power2.out" })
    .to(head, { rotation: 9, duration: 0.2 }, "<")
    .to(beak, { rotation: -7, duration: 0.18 }, "<")
    .to(leftWing, { rotation: 38, duration: 0.22, ease: "back.out(2)" }, "<")
    .to(rightWing, { rotation: -24, duration: 0.22, ease: "back.out(2)" }, "<")
    .fromTo(
      particles,
      { opacity: 0, scale: 0.2, rotation: -25 },
      { opacity: 1, scale: 1.18, rotation: 30, duration: 0.36, stagger: 0.03, ease: "back.out(2.6)" },
      "<0.05",
    )
    .to(body, { rotation: 7, duration: 0.18 })
    .to([body, head, beak, leftWing, rightWing], {
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 0.34,
      ease: "back.out(2)",
    })
    .to(particles, { opacity: 0, duration: 0.18 }, "-=0.24");
}


export const tropicalReactions = { play: playReaction, reset: reset } satisfies GsapReactionDefinition;
