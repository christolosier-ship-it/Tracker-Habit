import { useRef } from "react";
import type { MascotCreatureProps } from "../mascot.types";
import { useEditorialReaction } from "./useEditorialReaction";
import "./editorial-mascot.css";

const facets = [
  "58,48 84,38 76,72", "84,38 104,50 76,72", "104,50 122,42 118,78",
  "76,72 104,50 101,88", "101,88 118,78 122,112", "76,72 101,88 84,116",
  "84,116 101,88 122,112", "84,116 122,112 112,154", "112,154 122,112 147,145",
  "84,116 112,154 78,164", "78,164 112,154 98,190", "112,154 147,145 142,183",
] as const;

const burst = [
  [41, 45], [72, 24], [109, 20], [151, 31], [181, 62], [188, 111],
  [170, 164], [132, 190], [86, 195], [48, 170], [28, 126], [27, 82],
] as const;

export function EditorialMascot({ mood, reaction }: MascotCreatureProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  useEditorialReaction(svgRef, reaction ?? null);

  return (
    <svg
      ref={svgRef}
      className="mascot-svg mascot-editorial-pro"
      viewBox="0 0 220 220"
      aria-hidden="true"
      focusable="false"
      data-creature="editorial obsidian cat"
      data-mood={mood}
      data-reaction={reaction ?? "none"}
    >
      <defs>
        <linearGradient id="editorial-black" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#292a2f" />
          <stop offset=".48" stopColor="#0d0e12" />
          <stop offset="1" stopColor="#020306" />
        </linearGradient>
        <linearGradient id="editorial-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff0a6" />
          <stop offset=".45" stopColor="#d69a2f" />
          <stop offset="1" stopColor="#7d4d0c" />
        </linearGradient>
        <filter id="editorial-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <g className="editorial-rig">
        <ellipse cx="109" cy="199" rx="56" ry="8" fill="#000" opacity=".18" filter="url(#editorial-shadow)" />

        <g className="editorial-tail-motion" data-gsap>
          <path className="editorial-tail" d="M146 160c31-6 45-26 38-47-6-20-28-17-24 1 3 13 22 7 16-3" fill="none" stroke="#090a0e" strokeWidth="15" strokeLinecap="round" />
          <path d="M146 160c29-7 42-25 36-45" fill="none" stroke="#b88126" strokeWidth="1.5" opacity=".8" />
        </g>

        <g className="editorial-paw-left-motion" data-gsap>
          <path d="M86 154c-8 12-10 25-8 37" fill="none" stroke="#0b0c10" strokeWidth="17" strokeLinecap="round" />
          <ellipse cx="78" cy="193" rx="18" ry="10" fill="#08090d" stroke="#b88126" strokeWidth="1.5" />
          <path d="M70 190v7M78 189v8M86 190v7" stroke="#b88126" strokeWidth="1" />
        </g>
        <g className="editorial-paw-right-motion" data-gsap>
          <path d="M128 154c8 12 10 25 8 37" fill="none" stroke="#0b0c10" strokeWidth="17" strokeLinecap="round" />
          <ellipse cx="136" cy="193" rx="18" ry="10" fill="#08090d" stroke="#b88126" strokeWidth="1.5" />
          <path d="M128 190v7M136 189v8M144 190v7" stroke="#b88126" strokeWidth="1" />
        </g>

        <g className="editorial-body-motion" data-gsap>
          <g className="editorial-body">
            <path d="M72 103c7-24 24-36 38-36 24 0 43 24 48 59 5 37-11 58-48 58-36 0-52-22-46-57 2-10 4-18 8-24z" fill="url(#editorial-black)" stroke="#b88126" strokeWidth="2" />
            {facets.map((points, index) => (
              <polygon key={points} points={points} fill={index % 3 === 0 ? "#202127" : index % 3 === 1 ? "#111216" : "#08090c"} stroke="#8f651f" strokeWidth=".65" opacity=".96" />
            ))}
            <path d="M76 115c9 18 11 41 4 62M126 110c-2 25 3 48 16 66" fill="none" stroke="#bc8527" strokeWidth="1.2" opacity=".85" />
          </g>
        </g>

        <g className="editorial-head-motion" data-gsap>
          <g className="editorial-head">
            <g className="editorial-ear-left">
              <path d="M63 65L70 20l28 31z" fill="#090a0e" stroke="#b88126" strokeWidth="2" />
              <path d="M70 54l3-25 17 21z" fill="url(#editorial-gold)" opacity=".9" />
            </g>
            <g className="editorial-ear-right">
              <path d="M121 51l29-33 2 48z" fill="#090a0e" stroke="#b88126" strokeWidth="2" />
              <path d="M130 50l17-23 1 29z" fill="url(#editorial-gold)" opacity=".9" />
            </g>
            <path d="M65 61c8-23 26-33 43-33 23 0 42 18 44 43 2 25-17 44-45 44-29 0-49-18-46-43 1-4 2-8 4-11z" fill="url(#editorial-black)" stroke="#b88126" strokeWidth="2" />
            <path d="M68 62l27-17 14 28-35 17M109 73l26-20 13 30-30 19M95 45l20-12 14 20-20 20" fill="none" stroke="#72531e" strokeWidth="1" opacity=".9" />

            <g className="editorial-face editorial-face-neutral">
              <path d="M75 72q15-11 29 0-3 22-15 22-12 0-14-22z" fill="url(#editorial-gold)" stroke="#f7d67f" strokeWidth="1.5" />
              <path d="M114 72q15-11 29 0-3 22-15 22-12 0-14-22z" fill="url(#editorial-gold)" stroke="#f7d67f" strokeWidth="1.5" />
              <ellipse cx="91" cy="81" rx="3" ry="9" fill="#111" /><ellipse cx="130" cy="81" rx="3" ry="9" fill="#111" />
              <circle className="editorial-eye-shine" cx="88" cy="76" r="2.2" fill="#fff" /><circle className="editorial-eye-shine" cx="127" cy="76" r="2.2" fill="#fff" />
            </g>
            <g className="editorial-face editorial-face-happy">
              <path d="M76 80q13-13 27 0M115 80q13-13 27 0" fill="none" stroke="#d9a542" strokeWidth="4" strokeLinecap="round" />
            </g>
            <g className="editorial-face editorial-face-celebrate">
              <path d="M76 78q13-14 27 0M115 78q13-14 27 0" fill="none" stroke="#f2c45f" strokeWidth="4" strokeLinecap="round" />
              <path d="M98 99q11 12 22 0" fill="#d8a83f" stroke="#7d4d0c" strokeWidth="2" />
            </g>
            <g className="editorial-face editorial-face-worried">
              <path d="M76 73l24-5M116 68l24 5" stroke="#d1a148" strokeWidth="4" strokeLinecap="round" />
              <ellipse cx="89" cy="81" rx="5" ry="8" fill="#d6a73f" /><ellipse cx="129" cy="81" rx="5" ry="8" fill="#d6a73f" />
            </g>
            <g className="editorial-face editorial-face-sleepy">
              <path d="M76 81h25M116 81h25" stroke="#d6a73f" strokeWidth="4" strokeLinecap="round" />
            </g>

            <path d="M102 91q8-7 16 0-2 7-8 7t-8-7z" fill="url(#editorial-gold)" stroke="#5b3c0d" strokeWidth="1.5" />
            <path d="M110 98v5M110 103q-7 7-13 0M110 103q7 7 13 0" fill="none" stroke="#b88126" strokeWidth="2.3" strokeLinecap="round" />
            <path d="M76 95l-22 3M77 101l-22 9M143 95l22 3M142 101l22 9" stroke="#b88126" strokeWidth="1.4" strokeLinecap="round" />
          </g>
        </g>

        <g className="editorial-jewel-motion" data-gsap>
          <path d="M83 112q27 13 54 0" fill="none" stroke="url(#editorial-gold)" strokeWidth="5" strokeLinecap="round" />
          <circle cx="110" cy="119" r="5" fill="none" stroke="#d59a2e" strokeWidth="2" />
          <g className="editorial-jewel" transform="translate(110 133)">
            <path d="M0-11l9 8-3 12H-6L-9-3z" fill="url(#editorial-gold)" stroke="#f7d67f" strokeWidth="1.2" />
            <path d="M0-11v20M-9-3h18" stroke="#8f5a12" strokeWidth="1" />
          </g>
        </g>

        <g className="editorial-burst" data-gsap>
          {burst.map(([x, y], index) => (
            <g className="editorial-burst-particle" key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${index * 17})`}>
              {index % 2 === 0 ? (
                <path d="M0-7l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#e5b54f" />
              ) : (
                <path d="M0-6l6 6-6 6-6-6z" fill="#22242a" stroke="#d29a34" strokeWidth="1" />
              )}
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}
