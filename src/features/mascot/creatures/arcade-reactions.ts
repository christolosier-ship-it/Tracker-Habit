import type { MascotReaction } from "../mascot.types";

import { gsap, type GsapReactionDefinition } from "../gsap-runtime";

function reset(root: SVGSVGElement) {
  const targets = root.querySelectorAll<SVGElement>("[data-gsap]");
  const particles = root.querySelectorAll<SVGElement>(".arcade-burst-particle");
  gsap.set(targets, { clearProps: "transform,opacity" });
  gsap.set(particles, { opacity: 0, clearProps: "transform" });
}

function playReaction(root: SVGSVGElement, reaction: MascotReaction) {
  const body = root.querySelector<SVGElement>(".arcade-body-motion");
  const face = root.querySelector<SVGElement>(".arcade-face-motion");
  const eyes = root.querySelectorAll<SVGElement>(".arcade-eye");
  const glow = root.querySelector<SVGElement>(".arcade-glow-motion");
  const particles = Array.from(root.querySelectorAll<SVGElement>(".arcade-burst-particle"));
  const targets = root.querySelectorAll<SVGElement>("[data-gsap]");

  gsap.killTweensOf(targets);
  reset(root);
  gsap.set([body, face, glow, particles], { transformOrigin: "50% 50%" });

  const timeline = gsap.timeline({
    defaults: { overwrite: "auto" },
    onComplete: () => reset(root),
  });

  if (reaction === "habit-done") {
    return timeline
      .to(body, { y: -12, scaleY: 1.08, duration: 0.16, ease: "steps(4)" })
      .to(eyes, { x: 5, duration: 0.1, ease: "steps(1)" }, "<")
      .fromTo(particles, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1.15, duration: 0.24, stagger: 0.03, ease: "steps(3)" }, "<0.04")
      .to(body, { y: 0, scaleY: 1, duration: 0.24, ease: "steps(4)" })
      .to(particles, { opacity: 0, duration: 0.12 }, "-=0.12");
  }

  if (reaction === "perfect-day") {
    return timeline
      .to(body, { y: -24, scale: 1.12, rotation: -4, duration: 0.24, ease: "steps(5)" })
      .to(face, { scale: 1.1, duration: 0.12, yoyo: true, repeat: 1 }, "<")
      .to(glow, { scale: 1.35, opacity: 1, duration: 0.2 }, "<")
      .fromTo(particles, { opacity: 0, scale: 0.25, y: 8 }, { opacity: 1, scale: 1.35, y: -10, rotation: 90, duration: 0.42, stagger: 0.035, ease: "steps(5)" }, "<0.05")
      .to(body, { y: 2, rotation: 4, duration: 0.2, ease: "steps(3)" })
      .to([body, glow], { y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.28, ease: "steps(5)" })
      .to(particles, { opacity: 0, duration: 0.16 }, "-=0.2");
  }

  return timeline
    .to(body, { x: -8, rotation: -6, duration: 0.14, ease: "steps(2)" })
    .to(body, { x: 8, rotation: 6, duration: 0.14, ease: "steps(2)" })
    .to(body, { x: -4, rotation: -3, duration: 0.12, ease: "steps(2)" })
    .fromTo(particles, { opacity: 0, scale: 0.35 }, { opacity: 1, scale: 1.2, duration: 0.3, stagger: 0.025, ease: "steps(4)" }, "<")
    .to(body, { x: 0, rotation: 0, duration: 0.2, ease: "steps(3)" })
    .to(particles, { opacity: 0, duration: 0.14 }, "-=0.12");
}


export const arcadeReactions = { play: playReaction, reset: reset } satisfies GsapReactionDefinition;
