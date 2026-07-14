import { useRef } from "react";
import type { MascotCreatureProps } from "../mascot.types";
import { cosmicReactions } from "./cosmic-reactions";
import { useGsapReactionRuntime } from "../gsap-runtime";
import "./cosmic-mascot.css";

const stars = [
  [62, 54, 2.4], [79, 45, 1.8], [97, 57, 2.1], [126, 51, 1.7],
  [145, 65, 2.2], [156, 86, 1.6], [135, 102, 1.9], [110, 110, 1.5],
  [84, 104, 2.0], [66, 86, 1.6], [102, 72, 1.4], [120, 86, 1.9],
] as const;

const particles = [
  [40, 44], [61, 29], [91, 20], [127, 25], [160, 42], [178, 72],
  [174, 126], [148, 161], [108, 177], [67, 164], [39, 134], [28, 92],
] as const;

export function CosmicMascot({ mood, reaction, onReactionComplete }: MascotCreatureProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  useGsapReactionRuntime(
    svgRef, reaction ?? null, cosmicReactions.play, cosmicReactions.reset, onReactionComplete,
  );

  return (
    <svg
      ref={svgRef}
      className="mascot-svg mascot-cosmic-pro"
      viewBox="0 0 220 220"
      aria-hidden="true"
      focusable="false"
      data-creature="living cosmic planet pro"
      data-mood={mood}
      data-reaction={reaction ?? "none"}
    >
      <defs>
        <radialGradient id="cosmic-body" cx="35%" cy="24%" r="82%">
          <stop offset="0" stopColor="#ffd9a6" />
          <stop offset="0.32" stopColor="#ff91ba" />
          <stop offset="0.68" stopColor="#8b6be8" />
          <stop offset="1" stopColor="#493ca8" />
        </radialGradient>
        <linearGradient id="cosmic-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7f50db" />
          <stop offset="0.35" stopColor="#ff8fc5" />
          <stop offset="0.68" stopColor="#ffd391" />
          <stop offset="1" stopColor="#9c57ea" />
        </linearGradient>
        <linearGradient id="cosmic-limb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ca68ca" />
          <stop offset="1" stopColor="#6f3ea2" />
        </linearGradient>
        <filter id="cosmic-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <g className="cosmic-rig">
        <ellipse cx="111" cy="195" rx="53" ry="8" fill="#3d276d" opacity="0.15" />

        <g className="cosmic-leg-left-motion" data-gsap>
          <path d="M88 151c-4 16-6 25-4 34" fill="none" stroke="url(#cosmic-limb)" strokeWidth="14" strokeLinecap="round" />
          <path d="M65 188c0-11 8-18 20-18 12 0 20 8 20 19 0 8-8 12-21 12-12 0-19-4-19-13z" fill="url(#cosmic-limb)" stroke="#55318a" strokeWidth="2.5" />
        </g>
        <g className="cosmic-leg-right-motion" data-gsap>
          <path d="M135 151c4 16 6 25 4 34" fill="none" stroke="url(#cosmic-limb)" strokeWidth="14" strokeLinecap="round" />
          <path d="M118 188c0-11 8-18 20-18 12 0 20 8 20 19 0 8-8 12-21 12-12 0-19-4-19-13z" fill="url(#cosmic-limb)" stroke="#55318a" strokeWidth="2.5" />
        </g>

        <g className="cosmic-arm-left-motion" data-gsap>
          <path d="M57 118c-15 10-19 22-24 36" fill="none" stroke="url(#cosmic-limb)" strokeWidth="13" strokeLinecap="round" />
          <path d="M21 157c-3-7 2-15 9-17 4-1 6 2 6 5 2-5 7-7 10-4 3 3 1 8-2 11 4-1 7 2 7 6 0 7-9 14-18 14-6 0-10-5-12-15z" fill="url(#cosmic-limb)" stroke="#55318a" strokeWidth="2.2" />
        </g>
        <g className="cosmic-arm-right-motion" data-gsap>
          <path d="M163 114c13 8 19 19 25 30" fill="none" stroke="url(#cosmic-limb)" strokeWidth="13" strokeLinecap="round" />
          <path d="M182 148c0-8 6-14 13-14 4 0 6 3 5 6 4-4 9-3 11 1 2 4-1 8-5 10 4 1 6 5 4 9-3 7-13 10-22 7-6-2-9-8-6-19z" fill="url(#cosmic-limb)" stroke="#55318a" strokeWidth="2.2" />
        </g>

        <g className="cosmic-ring-motion" data-gsap>
          <ellipse cx="110" cy="109" rx="95" ry="29" fill="none" stroke="#6839b8" strokeWidth="14" opacity="0.28" />
          <ellipse cx="110" cy="109" rx="96" ry="25" fill="none" stroke="url(#cosmic-ring)" strokeWidth="10" />
          <ellipse cx="110" cy="109" rx="88" ry="18" fill="none" stroke="#ffe4b5" strokeWidth="3.5" opacity="0.75" />
        </g>

        <g className="cosmic-body-motion" data-gsap>
          <circle cx="110" cy="100" r="70" fill="url(#cosmic-body)" stroke="#a951aa" strokeWidth="3" />
          <ellipse cx="85" cy="61" rx="30" ry="12" fill="#fff" opacity="0.25" transform="rotate(-20 85 61)" />
          <path d="M48 77c28-20 76-33 124-21M45 96c32-15 90-21 132-8M50 122c38-7 84-5 125 8M64 145c34 7 65 12 96 7" fill="none" stroke="#ffd4ad" strokeWidth="5" strokeLinecap="round" opacity="0.35" />
          <path d="M57 82c32-12 74-20 110-15M60 113c29-9 73-9 103-2M72 139c27 5 54 8 79 5" fill="none" stroke="#5b67ce" strokeWidth="6" strokeLinecap="round" opacity="0.45" />

          {stars.map(([x, y, r], index) => (
            <circle key={`${x}-${y}`} className="cosmic-star" cx={x} cy={y} r={r} fill={index % 3 === 0 ? "#fff4c6" : "#ffffff"} />
          ))}

          <g className="cosmic-face-motion" data-gsap>
            <g className="cosmic-face cosmic-face-neutral">
              <ellipse cx="86" cy="100" rx="12" ry="17" fill="#120f2f" />
              <ellipse cx="137" cy="94" rx="12" ry="17" fill="#120f2f" />
              <ellipse cx="82" cy="94" rx="4" ry="6" fill="#fff" />
              <ellipse cx="133" cy="88" rx="4" ry="6" fill="#fff" />
              <path d="M99 119q13 12 27-1" fill="none" stroke="#25133f" strokeWidth="4" strokeLinecap="round" />
            </g>
            <g className="cosmic-face cosmic-face-happy">
              <path d="M75 99q11-12 22 0M126 94q11-12 22 0" fill="none" stroke="#20143d" strokeWidth="5" strokeLinecap="round" />
              <path d="M98 116q15 20 30-1" fill="#a72c91" stroke="#45135d" strokeWidth="3" />
            </g>
            <g className="cosmic-face cosmic-face-celebrate">
              <path d="M86 84l4 9 9 4-9 4-4 9-4-9-9-4 9-4zM137 79l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" fill="#20143d" />
              <path d="M96 113q17 23 34 0" fill="#a72c91" stroke="#45135d" strokeWidth="3" />
            </g>
            <g className="cosmic-face cosmic-face-worried">
              <ellipse cx="86" cy="101" rx="10" ry="14" fill="#120f2f" />
              <ellipse cx="137" cy="95" rx="10" ry="14" fill="#120f2f" />
              <path d="M76 83l18-5M128 78l18 5" stroke="#20143d" strokeWidth="4" strokeLinecap="round" />
              <path d="M100 122q12-10 24 0" fill="none" stroke="#45135d" strokeWidth="4" strokeLinecap="round" />
            </g>
            <g className="cosmic-face cosmic-face-sleepy">
              <path d="M75 100h22M126 95h22" stroke="#20143d" strokeWidth="5" strokeLinecap="round" />
              <path d="M102 121q9 5 18 0" fill="none" stroke="#45135d" strokeWidth="4" strokeLinecap="round" />
            </g>
            <circle cx="69" cy="116" r="8" fill="#ff8ba8" opacity="0.75" />
            <circle cx="156" cy="110" r="8" fill="#ff8ba8" opacity="0.75" />
          </g>
        </g>

        <g className="cosmic-particle-field" data-gsap>
          {particles.map(([x, y], index) => (
            <path
              key={`${x}-${y}`}
              className="cosmic-particle"
              d={`M${x} ${y - 5}l2 3 4 2-4 2-2 4-2-4-4-2 4-2z`}
              fill={index % 2 === 0 ? "#ffd1a6" : "#c98cff"}
              filter="url(#cosmic-glow)"
            />
          ))}
        </g>
      </g>
    </svg>
  );
}
