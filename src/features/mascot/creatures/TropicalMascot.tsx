import { useRef } from "react";
import type { MascotCreatureProps } from "../mascot.types";
import { useTropicalReaction } from "./useTropicalReaction";
import "./tropical-mascot.css";

const flowers = [
  [74, 99, "#ff5a3d"],
  [94, 110, "#ffb300"],
  [114, 116, "#ff5f91"],
  [134, 109, "#ffb300"],
  [151, 98, "#ff4a22"],
] as const;

export function TropicalMascot({ mood, reaction }: MascotCreatureProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  useTropicalReaction(svgRef, reaction ?? null);

  return (
    <svg
      ref={svgRef}
      className="mascot-svg mascot-tropical-pro"
      viewBox="0 0 220 220"
      aria-hidden="true"
      focusable="false"
      data-creature="festival toucan pro"
      data-mood={mood}
      data-reaction={reaction ?? "none"}
    >
      <defs>
        <linearGradient id="tropical-black" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#15313d" />
          <stop offset="0.48" stopColor="#07131d" />
          <stop offset="1" stopColor="#02070c" />
        </linearGradient>
        <linearGradient id="tropical-teal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3fd4c5" />
          <stop offset="0.5" stopColor="#0d8d88" />
          <stop offset="1" stopColor="#07545d" />
        </linearGradient>
        <linearGradient id="tropical-beak" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffd33d" />
          <stop offset="0.45" stopColor="#ff9f00" />
          <stop offset="0.76" stopColor="#f54042" />
          <stop offset="1" stopColor="#20242b" />
        </linearGradient>
        <linearGradient id="tropical-cream" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff8dc" />
          <stop offset="1" stopColor="#e9cda1" />
        </linearGradient>
        <filter id="tropical-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <g className="tropical-rig">
        <ellipse cx="112" cy="202" rx="49" ry="7" fill="#173c2f" opacity="0.18" filter="url(#tropical-shadow)" />

        <g className="tropical-leg-left-motion" data-gsap>
          <path d="M91 166c-2 11-2 20 0 28" fill="none" stroke="#f19412" strokeWidth="9" strokeLinecap="round" />
          <path d="M75 197c3-8 9-12 18-11 8 1 13 5 15 12-7 4-25 4-33-1z" fill="#f9a217" stroke="#b75f00" strokeWidth="2" />
          <path d="M83 193l-6 8M94 192l-1 10M102 194l5 7" stroke="#2b3037" strokeWidth="3" strokeLinecap="round" />
        </g>

        <g className="tropical-leg-right-motion" data-gsap>
          <path d="M133 166c2 11 2 20 0 28" fill="none" stroke="#f19412" strokeWidth="9" strokeLinecap="round" />
          <path d="M119 198c3-8 9-12 18-11 8 1 13 5 15 12-7 4-25 4-33-1z" fill="#f9a217" stroke="#b75f00" strokeWidth="2" />
          <path d="M127 194l-6 8M138 193l-1 10M146 195l5 7" stroke="#2b3037" strokeWidth="3" strokeLinecap="round" />
        </g>

        <g className="tropical-wing-left-motion" data-gsap>
          <path d="M70 118c-23 10-31 30-26 50 18-4 33-17 39-40z" fill="url(#tropical-teal)" stroke="#063d46" strokeWidth="3" />
          <path d="M61 128c-11 12-15 24-13 35M69 127c-7 15-9 25-6 34" fill="none" stroke="#52ded0" strokeWidth="2" opacity="0.55" />
        </g>

        <g className="tropical-wing-right-motion" data-gsap>
          <path d="M151 119c20 8 29 25 27 44-17-4-30-14-38-34z" fill="url(#tropical-teal)" stroke="#063d46" strokeWidth="3" />
          <path d="M156 128c10 10 14 19 14 29M149 128c7 12 10 22 9 31" fill="none" stroke="#52ded0" strokeWidth="2" opacity="0.55" />
        </g>

        <g className="tropical-body-motion" data-gsap>
          <ellipse cx="111" cy="143" rx="55" ry="48" fill="url(#tropical-black)" stroke="#041018" strokeWidth="3" />
          <path d="M77 154c13 14 54 19 70 0-6 24-20 36-36 36-17 0-29-12-34-36z" fill="#0d202a" opacity="0.72" />
        </g>

        <g className="tropical-head-motion" data-gsap>
          <path d="M57 94c0-43 22-68 57-68 31 0 50 22 50 55 0 30-18 53-50 53-35 0-57-16-57-40z" fill="url(#tropical-black)" stroke="#041018" strokeWidth="3" />
          <path d="M69 88c0-33 15-51 38-51 22 0 35 17 35 45 0 25-13 42-36 42-24 0-37-12-37-36z" fill="url(#tropical-cream)" />
          <path d="M60 61c6-18 18-30 37-36-8 10-14 21-17 35z" fill="#15313d" />
          <path d="M58 55l-12-11 17 3-8-15 18 11-2-18 14 17" fill="#102631" />

          <g className="tropical-face tropical-face-neutral">
            <ellipse cx="91" cy="72" rx="11" ry="15" fill="#111" />
            <ellipse className="tropical-eye-shine" cx="87" cy="66" rx="4" ry="6" fill="#fff" />
          </g>
          <g className="tropical-face tropical-face-happy">
            <path d="M80 72q11-13 22 0" fill="none" stroke="#111" strokeWidth="5" strokeLinecap="round" />
          </g>
          <g className="tropical-face tropical-face-celebrate">
            <path d="M80 72l5-7 6 7 6-7 5 7" fill="none" stroke="#111" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g className="tropical-face tropical-face-worried">
            <ellipse cx="91" cy="73" rx="9" ry="13" fill="#111" />
            <path d="M80 56l17-5" stroke="#111" strokeWidth="4" strokeLinecap="round" />
          </g>
          <g className="tropical-face tropical-face-sleepy">
            <path d="M80 72h22" stroke="#111" strokeWidth="5" strokeLinecap="round" />
          </g>
        </g>

        <g className="tropical-beak-motion" data-gsap>
          <path d="M105 56c42-10 80 2 92 25-16 8-46 11-87 6z" fill="url(#tropical-beak)" stroke="#6f2700" strokeWidth="3" />
          <path d="M109 86c31 7 59 7 83-2-10 17-39 25-72 16z" fill="#f47700" stroke="#6f2700" strokeWidth="3" />
          <path d="M175 70c8 1 15 5 20 11-3 2-8 3-13 4z" fill="#242831" />
          <ellipse cx="136" cy="64" rx="27" ry="8" fill="#fff" opacity="0.22" transform="rotate(-8 136 64)" />
        </g>

        <g className="tropical-garland-motion" data-gsap>
          <path d="M68 104c20 12 65 17 91-1" fill="none" stroke="#2d6d25" strokeWidth="8" strokeLinecap="round" />
          <path d="M72 99c-11-10-18-9-23 1 10 6 18 5 23-1zM151 97c9-11 17-11 23-2-8 7-16 8-23 2z" fill="#4d9d21" stroke="#276512" strokeWidth="2" />
          {flowers.map(([x, y, color], index) => (
            <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${index * 13})`}>
              <circle r="5" fill={color} />
              <circle cx="0" cy="-6" r="5" fill={color} />
              <circle cx="5.5" cy="-2" r="5" fill={color} />
              <circle cx="-5.5" cy="-2" r="5" fill={color} />
              <circle className="tropical-flower-center" r="2.6" fill="#ffd22a" />
            </g>
          ))}
        </g>

        <g data-gsap>
          {[
            [44, 66, "#ff5a3d"], [62, 45, "#ffd32a"], [89, 29, "#42c96f"],
            [146, 34, "#ff6b91"], [178, 48, "#27c9bf"], [191, 105, "#ffd32a"],
            [176, 163, "#ff5a3d"], [146, 184, "#42c96f"], [75, 183, "#ff6b91"],
            [43, 151, "#27c9bf"],
          ].map(([x, y, color], index) => (
            <path
              className="tropical-burst-particle"
              key={`${x}-${y}`}
              d={`M${x} ${Number(y) - 6}l2.4 3.6 4.2 1.3-3 3.1.2 4.4-3.8-2.2-3.8 2.2.2-4.4-3-3.1 4.2-1.3z`}
              fill={String(color)}
              transform={`rotate(${index * 23} ${x} ${y})`}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}
