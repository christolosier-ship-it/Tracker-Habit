import { useEffect, useRef } from "react";
import { MascotCreatureProps, MascotReaction } from "../mascot.types";
import "./cyberpunk-mascot.css";

type GsapTarget =
  | Element
  | Element[]
  | NodeListOf<Element>
  | string
  | null;

type GsapVars = Record<string, unknown>;

type GsapTimeline = {
  to: (
    target: GsapTarget,
    vars: GsapVars,
    position?: string | number,
  ) => GsapTimeline;
  fromTo: (
    target: GsapTarget,
    fromVars: GsapVars,
    toVars: GsapVars,
    position?: string | number,
  ) => GsapTimeline;
  set: (
    target: GsapTarget,
    vars: GsapVars,
    position?: string | number,
  ) => GsapTimeline;
  kill: () => void;
};

type GsapApi = {
  timeline: (vars?: GsapVars) => GsapTimeline;
  set: (target: GsapTarget, vars: GsapVars) => void;
  killTweensOf: (target: GsapTarget) => void;
};

declare global {
  interface Window {
    gsap?: GsapApi;
  }
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function playReaction(
  gsap: GsapApi,
  root: SVGSVGElement,
  reaction: MascotReaction,
) {
  const body = root.querySelector<SVGElement>(".cyber-body-motion");
  const leftArm = root.querySelector<SVGElement>(".cyber-arm-motion-left");
  const rightArm = root.querySelector<SVGElement>(".cyber-arm-motion-right");
  const leftRotor = root.querySelector<SVGElement>(".cyber-rotor-motion-left");
  const rightRotor = root.querySelector<SVGElement>(".cyber-rotor-motion-right");
  const propellers = root.querySelectorAll<SVGElement>(".cyber-propeller");
  const reactor = root.querySelector<SVGElement>(".cyber-reactor-motion");
  const face = root.querySelector<SVGElement>(".cyber-face");
  const ring = root.querySelector<SVGElement>(".cyber-status-ring");
  const particles = Array.from(
    root.querySelectorAll<SVGElement>(".cyber-particle"),
  );
  const animatedParts = root.querySelectorAll<SVGElement>("[data-gsap]");

  gsap.killTweensOf(animatedParts);
  gsap.set(animatedParts, { clearProps: "transform" });
  gsap.set(particles, { opacity: 0, scale: 0.45 });

  const timeline = gsap.timeline({ defaults: { overwrite: "auto" } });

  if (reaction === "habit-done") {
    return timeline
      .to(body, {
        y: -12,
        scaleX: 1.06,
        scaleY: 0.93,
        duration: 0.17,
        ease: "power2.out",
      })
      .to(leftArm, { rotation: -18, duration: 0.2, ease: "power2.out" }, "<")
      .to(rightArm, { rotation: 18, duration: 0.2, ease: "power2.out" }, "<")
      .to(reactor, { scaleY: 1.35, duration: 0.18, ease: "power2.out" }, "<")
      .fromTo(
        particles,
        { opacity: 0, scale: 0.35, y: 4 },
        {
          opacity: 1,
          scale: 1.15,
          y: -5,
          duration: 0.26,
          stagger: 0.025,
          ease: "back.out(2.4)",
        },
        "<0.04",
      )
      .to(body, {
        y: 2,
        scaleX: 0.97,
        scaleY: 1.04,
        duration: 0.18,
        ease: "power2.in",
      })
      .to(
        [body, leftArm, rightArm, reactor],
        {
          y: 0,
          rotation: 0,
          scale: 1,
          scaleX: 1,
          scaleY: 1,
          duration: 0.25,
          ease: "back.out(2)",
        },
        "<",
      )
      .to(particles, { opacity: 0, scale: 0.55, duration: 0.16 }, "-=0.18");
  }

  if (reaction === "perfect-day") {
    return timeline
      .to(body, {
        y: -25,
        scale: 1.08,
        duration: 0.27,
        ease: "power3.out",
      })
      .to(leftArm, { rotation: -66, y: -4, duration: 0.3, ease: "back.out(2)" }, "<")
      .to(rightArm, { rotation: 66, y: -4, duration: 0.3, ease: "back.out(2)" }, "<")
      .to([leftRotor, rightRotor], { y: -6, scale: 1.08, duration: 0.25 }, "<")
      .to(propellers, { rotation: "+=720", duration: 0.52, ease: "power2.inOut" }, "<")
      .to(reactor, { scaleY: 1.65, scaleX: 1.18, duration: 0.24 }, "<")
      .fromTo(
        particles,
        { opacity: 0, scale: 0.2, y: 8 },
        {
          opacity: 1,
          scale: 1.35,
          y: -9,
          rotation: 36,
          duration: 0.42,
          stagger: 0.035,
          ease: "back.out(3)",
        },
        "<0.08",
      )
      .to(face, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1 }, "<")
      .to(body, { y: 3, scale: 0.98, duration: 0.28, ease: "power2.in" })
      .to(
        [body, leftArm, rightArm, leftRotor, rightRotor, reactor],
        {
          y: 0,
          rotation: 0,
          scale: 1,
          scaleX: 1,
          scaleY: 1,
          duration: 0.34,
          ease: "elastic.out(1, 0.55)",
        },
      )
      .to(particles, { opacity: 0, scale: 0.4, duration: 0.2 }, "-=0.3");
  }

  return timeline
    .to(ring, { scale: 1.35, opacity: 0.95, duration: 0.28, ease: "power2.out" })
    .to(body, { rotation: -8, y: -10, duration: 0.22, ease: "power2.out" }, "<")
    .to(leftArm, { rotation: -58, duration: 0.25, ease: "back.out(2)" }, "<")
    .to(rightArm, { rotation: 24, duration: 0.25, ease: "back.out(2)" }, "<")
    .to(propellers, { rotation: "+=540", duration: 0.46, ease: "power2.inOut" }, "<")
    .fromTo(
      particles,
      { opacity: 0, scale: 0.25, rotation: -30 },
      {
        opacity: 1,
        scale: 1.2,
        rotation: 30,
        duration: 0.36,
        stagger: 0.03,
        ease: "back.out(2.6)",
      },
      "<0.06",
    )
    .to(body, { rotation: 8, duration: 0.2, ease: "sine.inOut" })
    .to(body, { rotation: -4, duration: 0.16, ease: "sine.inOut" })
    .to(
      [body, leftArm, rightArm, ring],
      {
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 0.34,
        ease: "back.out(2)",
      },
    )
    .to(particles, { opacity: 0, scale: 0.45, duration: 0.2 }, "-=0.24");
}

export function CyberpunkMascot({ mood, reaction }: MascotCreatureProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!reaction || prefersReducedMotion()) return undefined;

    let cancelled = false;
    let frameId = 0;
    let timeline: GsapTimeline | undefined;
    let attempts = 0;

    const start = () => {
      if (cancelled) return;

      const gsap = window.gsap;
      const root = svgRef.current;
      if (!gsap || !root) {
        attempts += 1;
        if (attempts < 120) frameId = window.requestAnimationFrame(start);
        return;
      }

      timeline = playReaction(gsap, root, reaction);
    };

    start();

    return () => {
      cancelled = true;
      if (frameId) window.cancelAnimationFrame(frameId);
      timeline?.kill();
    };
  }, [reaction]);

  return (
    <svg
      ref={svgRef}
      className="mascot-svg mascot-cyberpunk-pro"
      viewBox="0 0 220 220"
      aria-hidden="true"
      focusable="false"
      data-creature="neon drone pro"
      data-mood={mood}
      data-reaction={reaction ?? "none"}
    >
      <defs>
        <linearGradient id="cyber-shell" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#243253" />
          <stop offset="0.45" stopColor="#071225" />
          <stop offset="1" stopColor="#020611" />
        </linearGradient>
        <linearGradient id="cyber-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#26375a" />
          <stop offset="0.55" stopColor="#071226" />
          <stop offset="1" stopColor="#02040c" />
        </linearGradient>
        <linearGradient id="cyber-neon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ff00df" />
          <stop offset="0.52" stopColor="#9b20ff" />
          <stop offset="1" stopColor="#00eaff" />
        </linearGradient>
        <linearGradient id="cyber-flame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.18" stopColor="#00f7ff" />
          <stop offset="0.62" stopColor="#20b9ff" stopOpacity="0.92" />
          <stop offset="1" stopColor="#00d9ff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="cyber-visor" cx="42%" cy="30%" r="85%">
          <stop offset="0" stopColor="#13224b" />
          <stop offset="0.55" stopColor="#04091b" />
          <stop offset="1" stopColor="#01030a" />
        </radialGradient>
        <filter id="cyber-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="cyber-strong-glow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="cyber-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <g className="cyber-rig">
        <ellipse
          className="cyber-shadow"
          cx="110"
          cy="199"
          rx="45"
          ry="8"
          fill="#071328"
          opacity="0.28"
          filter="url(#cyber-shadow)"
        />
        <circle
          className="cyber-status-ring"
          data-gsap
          cx="110"
          cy="111"
          r="73"
          fill="none"
          stroke="#00eaff"
          strokeWidth="1.5"
          strokeDasharray="5 9"
          filter="url(#cyber-glow)"
        />

        <g className="cyber-rotor-motion-left" data-gsap>
          <g className="cyber-rotor cyber-rotor-left">
            <path d="M72 68C59 55 57 38 61 23" fill="none" stroke="#070d20" strokeWidth="13" strokeLinecap="round" />
            <path d="M72 68C59 55 57 38 61 23" fill="none" stroke="url(#cyber-neon)" strokeWidth="2.4" strokeLinecap="round" />
            <ellipse cx="59" cy="19" rx="34" ry="8" fill="#040713" stroke="#ff00df" strokeWidth="3" filter="url(#cyber-glow)" />
            <g className="cyber-propeller" data-gsap>
              <path d="M30 19C39 12 51 12 59 19C50 24 39 24 30 19Z" fill="#331044" />
              <path d="M88 19C79 12 67 12 59 19C68 24 79 24 88 19Z" fill="#102944" />
            </g>
            <ellipse cx="59" cy="19" rx="6" ry="5" fill="#121a36" stroke="#00eaff" strokeWidth="1.5" />
          </g>
        </g>

        <g className="cyber-rotor-motion-right" data-gsap>
          <g className="cyber-rotor cyber-rotor-right">
            <path d="M148 68C161 55 163 38 159 23" fill="none" stroke="#070d20" strokeWidth="13" strokeLinecap="round" />
            <path d="M148 68C161 55 163 38 159 23" fill="none" stroke="url(#cyber-neon)" strokeWidth="2.4" strokeLinecap="round" />
            <ellipse cx="161" cy="19" rx="34" ry="8" fill="#040713" stroke="#ff00df" strokeWidth="3" filter="url(#cyber-glow)" />
            <g className="cyber-propeller" data-gsap>
              <path d="M132 19C141 12 153 12 161 19C152 24 141 24 132 19Z" fill="#102944" />
              <path d="M190 19C181 12 169 12 161 19C170 24 181 24 190 19Z" fill="#331044" />
            </g>
            <ellipse cx="161" cy="19" rx="6" ry="5" fill="#121a36" stroke="#00eaff" strokeWidth="1.5" />
          </g>
        </g>

        <g className="cyber-reactor-motion" data-gsap>
          <g className="cyber-reactor">
            <path d="M88 164H132L127 178H93Z" fill="url(#cyber-metal)" stroke="#ff00df" strokeWidth="2" />
            <ellipse cx="110" cy="177" rx="17" ry="5" fill="#071327" stroke="#00eaff" strokeWidth="2" />
            <g className="cyber-reactor-flame">
              <path d="M96 179C99 195 103 209 110 219C117 207 122 194 124 179Z" fill="url(#cyber-flame)" filter="url(#cyber-glow)" />
              <path d="M103 179C105 194 107 203 110 210C114 201 116 192 117 179Z" fill="#ffffff" opacity="0.66" />
            </g>
          </g>
        </g>

        <g className="cyber-arm-motion-left" data-gsap>
          <g className="cyber-arm cyber-arm-left">
            <path d="M65 102C48 102 40 113 40 128" fill="none" stroke="#071328" strokeWidth="16" strokeLinecap="round" />
            <path d="M65 102C48 102 40 113 40 128" fill="none" stroke="url(#cyber-neon)" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="40" cy="132" r="12" fill="url(#cyber-metal)" stroke="#00eaff" strokeWidth="2" />
            <circle cx="40" cy="132" r="4" fill="#ff00df" filter="url(#cyber-glow)" />
            <g className="cyber-claw-left">
              <path d="M38 142C25 144 22 155 28 163C33 169 41 167 44 160" fill="none" stroke="#0a1329" strokeWidth="7" strokeLinecap="round" />
              <path d="M42 142C55 144 58 155 52 163C47 169 39 167 36 160" fill="none" stroke="#0a1329" strokeWidth="7" strokeLinecap="round" />
              <path d="M38 142C25 144 22 155 28 163" fill="none" stroke="#00eaff" strokeWidth="2" strokeLinecap="round" />
              <path d="M42 142C55 144 58 155 52 163" fill="none" stroke="#ff00df" strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>
        </g>

        <g className="cyber-arm-motion-right" data-gsap>
          <g className="cyber-arm cyber-arm-right">
            <path d="M155 102C172 102 180 113 180 128" fill="none" stroke="#071328" strokeWidth="16" strokeLinecap="round" />
            <path d="M155 102C172 102 180 113 180 128" fill="none" stroke="url(#cyber-neon)" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="180" cy="132" r="12" fill="url(#cyber-metal)" stroke="#ff00df" strokeWidth="2" />
            <circle cx="180" cy="132" r="4" fill="#00eaff" filter="url(#cyber-glow)" />
            <g className="cyber-claw-right">
              <path d="M178 142C165 144 162 155 168 163C173 169 181 167 184 160" fill="none" stroke="#0a1329" strokeWidth="7" strokeLinecap="round" />
              <path d="M182 142C195 144 198 155 192 163C187 169 179 167 176 160" fill="none" stroke="#0a1329" strokeWidth="7" strokeLinecap="round" />
              <path d="M178 142C165 144 162 155 168 163" fill="none" stroke="#00eaff" strokeWidth="2" strokeLinecap="round" />
              <path d="M182 142C195 144 198 155 192 163" fill="none" stroke="#ff00df" strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>
        </g>

        <g className="cyber-body-motion" data-gsap>
          <g className="cyber-body">
            <ellipse cx="110" cy="109" rx="61" ry="61" fill="url(#cyber-shell)" stroke="#02030a" strokeWidth="5" />
            <path d="M58 86C70 55 91 45 110 45C86 58 74 72 69 94Z" fill="#31456f" opacity="0.35" />
            <path d="M71 65C91 48 126 43 151 62" fill="none" stroke="#ff00df" strokeWidth="3" opacity="0.75" filter="url(#cyber-glow)" />
            <path d="M57 112C59 142 78 164 108 169" fill="none" stroke="#7c1cff" strokeWidth="3" opacity="0.76" />
            <path d="M163 106C162 139 144 161 116 169" fill="none" stroke="#00eaff" strokeWidth="3" opacity="0.88" />
            <ellipse className="cyber-core-glow" cx="110" cy="109" rx="48" ry="38" fill="none" stroke="url(#cyber-neon)" strokeWidth="5" filter="url(#cyber-glow)" />
            <rect x="64" y="73" width="92" height="72" rx="28" fill="url(#cyber-visor)" stroke="#09162f" strokeWidth="4" />
            <path className="cyber-screen-glow" d="M78 78H142" fill="none" stroke="#00eaff" strokeWidth="3" strokeLinecap="round" filter="url(#cyber-glow)" />
            <path d="M71 89C84 76 103 72 121 75" fill="none" stroke="#ffffff" strokeWidth="2.4" opacity="0.23" strokeLinecap="round" />
            <path className="cyber-scan-line" d="M76 104H144" fill="none" stroke="#00eaff" strokeWidth="1.5" opacity="0" filter="url(#cyber-glow)" />

            <g className="cyber-face" data-gsap>
              <g className="cyber-eye-pixels" fill="#00eaff" filter="url(#cyber-glow)">
                <g>
                  <rect x="84" y="94" width="5" height="6" rx="1" />
                  <rect x="90" y="94" width="5" height="6" rx="1" />
                  <rect x="96" y="94" width="5" height="6" rx="1" />
                  <rect x="84" y="101" width="5" height="6" rx="1" />
                  <rect x="90" y="101" width="5" height="6" rx="1" />
                  <rect x="96" y="101" width="5" height="6" rx="1" />
                  <rect x="84" y="108" width="5" height="6" rx="1" />
                  <rect x="90" y="108" width="5" height="6" rx="1" />
                  <rect x="96" y="108" width="5" height="6" rx="1" />
                </g>
                <g>
                  <rect x="119" y="94" width="5" height="6" rx="1" />
                  <rect x="125" y="94" width="5" height="6" rx="1" />
                  <rect x="131" y="94" width="5" height="6" rx="1" />
                  <rect x="119" y="101" width="5" height="6" rx="1" />
                  <rect x="125" y="101" width="5" height="6" rx="1" />
                  <rect x="131" y="101" width="5" height="6" rx="1" />
                  <rect x="119" y="108" width="5" height="6" rx="1" />
                  <rect x="125" y="108" width="5" height="6" rx="1" />
                  <rect x="131" y="108" width="5" height="6" rx="1" />
                </g>
              </g>
              <g className="cyber-sleep-eyes" fill="none" stroke="#00eaff" strokeWidth="4" strokeLinecap="round" filter="url(#cyber-glow)">
                <path d="M84 105H100" />
                <path d="M120 105H136" />
              </g>
              <g className="cyber-star-eyes" fill="#00eaff" filter="url(#cyber-glow)">
                <path d="M92 92L95 100L103 103L95 106L92 114L89 106L81 103L89 100Z" />
                <path d="M128 92L131 100L139 103L131 106L128 114L125 106L117 103L125 100Z" />
              </g>
              <g className="cyber-worry-brows cyber-brow" fill="none" stroke="#ff00df" strokeWidth="3" strokeLinecap="round" filter="url(#cyber-glow)">
                <path d="M83 91L100 96" />
                <path d="M137 91L120 96" />
              </g>
              <path className="cyber-mouth-neutral" d="M101 125H107V129H113V125H119" fill="none" stroke="#00eaff" strokeWidth="3" strokeLinecap="square" />
              <path className="cyber-mouth-happy" d="M99 123H104V128H110V131H116V128H121V123" fill="none" stroke="#00eaff" strokeWidth="3" strokeLinecap="square" />
              <path className="cyber-mouth-worried" d="M99 130H104V126H110V123H116V126H121V130" fill="none" stroke="#00eaff" strokeWidth="3" strokeLinecap="square" />
              <path className="cyber-mouth-sleepy" d="M105 127H115" fill="none" stroke="#00eaff" strokeWidth="3" strokeLinecap="round" />
              <g className="cyber-cheeks" fill="#ff00df" opacity="0.85" filter="url(#cyber-glow)">
                <rect x="77" y="121" width="9" height="3" rx="1.5" />
                <rect x="134" y="121" width="9" height="3" rx="1.5" />
              </g>
            </g>
          </g>
        </g>

        <g fill="#00eaff" filter="url(#cyber-glow)">
          <path className="cyber-particle" data-gsap d="M35 85L38 92L45 95L38 98L35 105L32 98L25 95L32 92Z" />
          <path className="cyber-particle" data-gsap d="M185 78L188 85L195 88L188 91L185 98L182 91L175 88L182 85Z" />
          <circle className="cyber-particle" data-gsap cx="52" cy="58" r="3" fill="#ff00df" />
          <circle className="cyber-particle" data-gsap cx="169" cy="57" r="3" fill="#00eaff" />
          <rect className="cyber-particle" data-gsap x="41" y="173" width="5" height="5" rx="1" fill="#7c1cff" />
          <rect className="cyber-particle" data-gsap x="174" y="169" width="5" height="5" rx="1" fill="#ff00df" />
        </g>
      </g>
    </svg>
  );
}
