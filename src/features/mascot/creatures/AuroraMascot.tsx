import { useRef } from "react";
import type { MascotCreatureProps } from "../mascot.types";
import { auroraReactions } from "./aurora-reactions";
import { useGsapReactionRuntime } from "../gsap-runtime";
import "./aurora-mascot.css";

const stars = [
  [79, 76, 2.2], [96, 69, 1.5], [124, 74, 2], [143, 88, 1.6],
  [67, 101, 1.8], [91, 111, 1.4], [118, 101, 2.4], [150, 116, 1.7],
  [80, 139, 2], [105, 147, 1.5], [136, 143, 2.1], [97, 165, 1.8],
  [124, 169, 1.4], [62, 131, 1.4], [158, 132, 1.3],
] as const;

export function AuroraMascot({ mood, reaction, onReactionComplete }: MascotCreatureProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  useGsapReactionRuntime(
    svgRef, reaction ?? null, auroraReactions.play, auroraReactions.reset, onReactionComplete,
  );

  return (
    <svg
      ref={svgRef}
      className="mascot-svg mascot-aurora-pro"
      viewBox="0 0 220 220"
      aria-hidden="true"
      focusable="false"
      data-creature="aurora jelly pro"
      data-mood={mood}
      data-reaction={reaction ?? "none"}
    >
      <defs>
        <linearGradient id="aurora-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f8b9ff" stopOpacity="0.95" />
          <stop offset="0.32" stopColor="#7a68ff" stopOpacity="0.92" />
          <stop offset="0.68" stopColor="#1abff5" stopOpacity="0.9" />
          <stop offset="1" stopColor="#b66bff" stopOpacity="0.92" />
        </linearGradient>
        <linearGradient id="aurora-core" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6978ff" />
          <stop offset="0.55" stopColor="#4e49d8" />
          <stop offset="1" stopColor="#1f2f9e" />
        </linearGradient>
        <linearGradient id="aurora-limb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7e61ff" />
          <stop offset="0.5" stopColor="#2dd0ff" />
          <stop offset="1" stopColor="#cf6dff" />
        </linearGradient>
        <radialGradient id="aurora-eye" cx="35%" cy="25%" r="75%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.2" stopColor="#776eff" />
          <stop offset="0.65" stopColor="#210e78" />
          <stop offset="1" stopColor="#08042a" />
        </radialGradient>
        <filter id="aurora-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="aurora-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <g className="aurora-rig">
        <ellipse cx="110" cy="201" rx="43" ry="7" fill="#31236e" opacity="0.18" filter="url(#aurora-shadow)" />

        <g className="aurora-leg-left-motion" data-gsap>
          <g className="aurora-leg aurora-leg-left">
            <path d="M85 157c-8 14-10 27-7 38 3 8 18 10 27 4 8-6 7-18 3-31" fill="url(#aurora-limb)" stroke="#7259ed" strokeWidth="3" />
            <ellipse cx="88" cy="194" rx="20" ry="11" fill="#8b70ff" opacity="0.72" />
          </g>
        </g>

        <g className="aurora-leg-right-motion" data-gsap>
          <g className="aurora-leg aurora-leg-right">
            <path d="M135 157c8 14 10 27 7 38-3 8-18 10-27 4-8-6-7-18-3-31" fill="url(#aurora-limb)" stroke="#7259ed" strokeWidth="3" />
            <ellipse cx="132" cy="194" rx="20" ry="11" fill="#8b70ff" opacity="0.72" />
          </g>
        </g>

        <g className="aurora-arm-left-motion" data-gsap>
          <g className="aurora-arm aurora-arm-left">
            <path d="M63 129c-18 8-29 20-31 35-2 12 8 19 18 14 12-7 20-22 24-38" fill="url(#aurora-limb)" stroke="#7259ed" strokeWidth="3" />
          </g>
        </g>

        <g className="aurora-arm-right-motion" data-gsap>
          <g className="aurora-arm aurora-arm-right">
            <path d="M157 129c18 8 29 20 31 35 2 12-8 19-18 14-12-7-20-22-24-38" fill="url(#aurora-limb)" stroke="#7259ed" strokeWidth="3" />
          </g>
        </g>

        <g className="aurora-body-motion" data-gsap>
          <g className="aurora-body">
            <path d="M64 117c0-27 20-45 46-45s46 18 46 45v26c0 15-9 26-22 31-8 3-14-7-24-7s-16 10-24 7c-13-5-22-16-22-31z" fill="url(#aurora-core)" stroke="#6d61e9" strokeWidth="3" />
            <path d="M70 116c0-22 17-37 40-37s40 15 40 37v20c-15 9-28 13-40 13s-25-4-40-13z" fill="url(#aurora-glass)" opacity="0.52" />
            {stars.slice(6).map(([x, y, r], index) => <circle className="aurora-star" key={`${x}-${y}`} cx={x} cy={y} r={r} fill={index % 2 ? "#ffb5ff" : "#bffaff"} />)}
          </g>
        </g>

        <g className="aurora-head-motion" data-gsap>
          <g className="aurora-head">
            <g className="aurora-halo-motion" data-gsap>
              <g className="aurora-halo" filter="url(#aurora-glow)">
                <path d="M77 48c0-15 13-25 33-25s33 10 33 25c0 7-4 12-10 14" fill="none" stroke="url(#aurora-glass)" strokeWidth="9" strokeLinecap="round" />
                <path d="M88 48c1-7 9-11 22-11 12 0 20 4 22 11" fill="none" stroke="#f6d8ff" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
              </g>
            </g>

            <path d="M53 98c0-37 24-61 57-61s57 24 57 61c0 19 9 25 11 38 2 13-12 23-24 18-11-5-18 7-28 5-7-1-10-7-16-7s-9 6-16 7c-10 2-17-10-28-5-12 5-26-5-24-18 2-13 11-19 11-38z" fill="url(#aurora-glass)" stroke="#9b73ff" strokeWidth="3.5" />
            <ellipse cx="88" cy="70" rx="25" ry="13" fill="#fff" opacity="0.28" transform="rotate(-28 88 70)" />
            {stars.slice(0, 9).map(([x, y, r], index) => <circle className="aurora-star" key={`${x}-${y}`} cx={x} cy={y} r={r} fill={index % 2 ? "#ffb5ff" : "#c5fbff"} />)}

            <g className="aurora-face-motion" data-gsap>
              <g className="aurora-face aurora-face-neutral">
                <ellipse cx="86" cy="103" rx="13" ry="18" fill="url(#aurora-eye)" stroke="#1d0b62" strokeWidth="2" />
                <ellipse cx="134" cy="103" rx="13" ry="18" fill="url(#aurora-eye)" stroke="#1d0b62" strokeWidth="2" />
                <circle cx="82" cy="97" r="4.5" fill="#fff" /><circle cx="130" cy="97" r="4.5" fill="#fff" />
                <path d="M99 124q11 11 22 0" fill="#9d47c7" stroke="#3c155f" strokeWidth="3" strokeLinecap="round" />
              </g>
              <g className="aurora-face aurora-face-happy">
                <g className="aurora-face-happy-eyes"><path d="M73 105q13-14 26 0M121 105q13-14 26 0" fill="none" stroke="#261064" strokeWidth="5" strokeLinecap="round" /></g>
                <path d="M96 122q14 20 28 0" fill="#b24ad1" stroke="#3c155f" strokeWidth="3" />
              </g>
              <g className="aurora-face aurora-face-worried">
                <ellipse cx="86" cy="105" rx="11" ry="15" fill="url(#aurora-eye)" /><ellipse cx="134" cy="105" rx="11" ry="15" fill="url(#aurora-eye)" />
                <path d="M75 86l18-5M127 81l18 5" stroke="#261064" strokeWidth="4" strokeLinecap="round" />
                <path d="M99 132q11-10 22 0" fill="none" stroke="#3c155f" strokeWidth="4" strokeLinecap="round" />
              </g>
              <g className="aurora-face aurora-face-sleepy">
                <path d="M73 105h26M121 105h26" stroke="#261064" strokeWidth="5" strokeLinecap="round" />
                <path d="M102 130q8 4 16 0" fill="none" stroke="#3c155f" strokeWidth="4" strokeLinecap="round" />
              </g>
              <g className="aurora-star-eyes"><path d="M86 90l4 9 9 4-9 4-4 9-4-9-9-4 9-4zM134 90l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" fill="#f9f0ff" stroke="#2d176e" strokeWidth="1.5" /></g>
              <circle cx="66" cy="124" r="7" fill="#ff87d8" opacity="0.65" /><circle cx="154" cy="124" r="7" fill="#ff87d8" opacity="0.65" />
            </g>
          </g>
        </g>

        <g data-gsap>
          {[[38,61],[58,42],[83,28],[137,31],[165,54],[186,91],[184,148],[155,183],[63,181],[34,143]].map(([x,y], index) => (
            <path className="aurora-burst-particle" key={`${x}-${y}`} d={`M${x} ${y-5}l2 3 4 2-4 2-2 4-2-4-4-2 4-2z`} fill={index % 2 ? "#ff9ff3" : "#8df7ff"} filter="url(#aurora-glow)" />
          ))}
        </g>
      </g>
    </svg>
  );
}
