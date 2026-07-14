import { useRef } from "react";
import type { MascotCreatureProps } from "../mascot.types";
import { useLiquidReaction } from "./useLiquidReaction";
import "./liquid-mascot.css";

const particles = [
  [35, 55, 5, "#5cecff"], [62, 31, 4, "#ff8be9"], [94, 22, 5, "#8d7dff"],
  [142, 34, 4, "#55dcff"], [178, 66, 6, "#ff83dc"], [190, 116, 5, "#7f72ff"],
  [170, 166, 4, "#5cecff"], [126, 192, 6, "#ff8be9"], [72, 187, 5, "#7f72ff"],
  [30, 146, 4, "#55dcff"], [22, 98, 5, "#ff83dc"],
] as const;

export function LiquidMascot({ mood, reaction }: MascotCreatureProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  useLiquidReaction(svgRef, reaction ?? null);

  return (
    <svg
      ref={svgRef}
      className="mascot-svg mascot-liquid-pro"
      viewBox="0 0 220 220"
      aria-hidden="true"
      focusable="false"
      data-creature="iridescent liquid drop"
      data-mood={mood}
      data-reaction={reaction ?? "none"}
    >
      <defs>
        <radialGradient id="liquid-body" cx="36%" cy="26%" r="82%">
          <stop offset="0" stopColor="#64f4ff" />
          <stop offset="0.38" stopColor="#14bfff" />
          <stop offset="0.7" stopColor="#5266f3" />
          <stop offset="1" stopColor="#ec6cdd" />
        </radialGradient>
        <linearGradient id="liquid-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9ff7ff" />
          <stop offset="0.48" stopColor="#6d72ff" />
          <stop offset="1" stopColor="#ff8de5" />
        </linearGradient>
        <radialGradient id="liquid-limb" cx="30%" cy="20%" r="85%">
          <stop offset="0" stopColor="#88fbff" />
          <stop offset="0.55" stopColor="#268df6" />
          <stop offset="1" stopColor="#df6ddd" />
        </radialGradient>
        <filter id="liquid-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <g className="liquid-rig">
        <ellipse cx="110" cy="198" rx="52" ry="8" fill="#2b4b84" opacity="0.16" filter="url(#liquid-shadow)" />

        <g className="liquid-leg-left-motion" data-gsap>
          <g className="liquid-leg-left">
            <path d="M84 160c-3 12-5 20-4 28" fill="none" stroke="url(#liquid-limb)" strokeWidth="15" strokeLinecap="round" />
            <ellipse cx="78" cy="190" rx="25" ry="15" fill="url(#liquid-limb)" stroke="#5266f3" strokeWidth="2.5" />
            <ellipse cx="70" cy="185" rx="9" ry="4" fill="#fff" opacity="0.5" />
          </g>
        </g>
        <g className="liquid-leg-right-motion" data-gsap>
          <g className="liquid-leg-right">
            <path d="M136 160c3 12 5 20 4 28" fill="none" stroke="url(#liquid-limb)" strokeWidth="15" strokeLinecap="round" />
            <ellipse cx="142" cy="190" rx="25" ry="15" fill="url(#liquid-limb)" stroke="#5266f3" strokeWidth="2.5" />
            <ellipse cx="134" cy="185" rx="9" ry="4" fill="#fff" opacity="0.5" />
          </g>
        </g>

        <g className="liquid-arm-left-motion" data-gsap>
          <g className="liquid-arm-left">
            <path d="M54 119c-14 8-21 18-28 27" fill="none" stroke="url(#liquid-limb)" strokeWidth="12" strokeLinecap="round" />
            <circle cx="24" cy="151" r="17" fill="url(#liquid-limb)" stroke="#5266f3" strokeWidth="2.5" />
            <ellipse cx="18" cy="145" rx="6" ry="4" fill="#fff" opacity="0.52" />
          </g>
        </g>
        <g className="liquid-arm-right-motion" data-gsap>
          <g className="liquid-arm-right">
            <path d="M166 119c14 8 21 18 28 27" fill="none" stroke="url(#liquid-limb)" strokeWidth="12" strokeLinecap="round" />
            <circle cx="196" cy="151" r="17" fill="url(#liquid-limb)" stroke="#5266f3" strokeWidth="2.5" />
            <ellipse cx="190" cy="145" rx="6" ry="4" fill="#fff" opacity="0.52" />
          </g>
        </g>

        <g className="liquid-body-motion" data-gsap>
          <g className="liquid-body">
            <path d="M110 22c22 25 58 62 58 105 0 36-25 57-58 57s-58-21-58-57c0-43 36-80 58-105z" fill="url(#liquid-body)" stroke="url(#liquid-edge)" strokeWidth="4" />
            <g className="liquid-tip-motion" data-gsap>
              <path className="liquid-tip" d="M109 24c-5 9-4 18 1 28 7-12 12-22 7-35-2 4-5 6-8 7z" fill="#70ecff" opacity="0.55" />
            </g>
            <path d="M72 52c-16 22-20 41-17 61" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" opacity="0.5" />
            <path className="liquid-highlight" d="M75 43c-10 10-15 20-17 30" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity="0.72" />
            <ellipse className="liquid-highlight" cx="72" cy="86" rx="9" ry="16" fill="#fff" opacity="0.32" transform="rotate(27 72 86)" />
            <circle className="liquid-bubble" cx="145" cy="74" r="6" fill="#8ff7ff" opacity="0.42" />
            <circle className="liquid-bubble" cx="154" cy="102" r="4" fill="#ff9be8" opacity="0.44" />
            <circle className="liquid-bubble" cx="63" cy="129" r="5" fill="#9bf8ff" opacity="0.38" />

            <g className="liquid-face-motion" data-gsap>
              <g className="liquid-face liquid-face-neutral">
                <ellipse cx="84" cy="119" rx="13" ry="18" fill="#10224f" />
                <ellipse cx="136" cy="119" rx="13" ry="18" fill="#10224f" />
                <ellipse cx="80" cy="111" rx="5" ry="7" fill="#fff" />
                <ellipse cx="132" cy="111" rx="5" ry="7" fill="#fff" />
                <path d="M98 141q12 11 24 0" fill="none" stroke="#2b155a" strokeWidth="4" strokeLinecap="round" />
              </g>
              <g className="liquid-face liquid-face-happy">
                <path d="M70 119q14-15 28 0M122 119q14-15 28 0" fill="none" stroke="#10224f" strokeWidth="5" strokeLinecap="round" />
                <path d="M96 139q14 17 28 0" fill="#7f49d8" stroke="#2b155a" strokeWidth="3" />
              </g>
              <g className="liquid-face liquid-face-celebrate">
                <path d="M69 117q15-17 30 0M121 117q15-17 30 0" fill="none" stroke="#10224f" strokeWidth="5" strokeLinecap="round" />
                <ellipse cx="110" cy="143" rx="14" ry="11" fill="#7f49d8" stroke="#2b155a" strokeWidth="3" />
              </g>
              <g className="liquid-face liquid-face-worried">
                <ellipse cx="84" cy="120" rx="11" ry="15" fill="#10224f" />
                <ellipse cx="136" cy="120" rx="11" ry="15" fill="#10224f" />
                <path d="M72 101l18-5M130 96l18 5M98 147q12-9 24 0" fill="none" stroke="#2b155a" strokeWidth="4" strokeLinecap="round" />
              </g>
              <g className="liquid-face liquid-face-sleepy">
                <path d="M70 120h28M122 120h28M99 144q11 6 22 0" fill="none" stroke="#10224f" strokeWidth="5" strokeLinecap="round" />
              </g>
            </g>
          </g>
        </g>

        <g className="liquid-burst" data-gsap>
          {particles.map(([x, y, r, color], index) => (
            <g className="liquid-burst-particle" key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${index * 23})`}>
              {index % 3 === 0 ? (
                <path d="M0-8l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill={color} />
              ) : index % 3 === 1 ? (
                <circle r={r} fill={color} />
              ) : (
                <path d="M0-7c5 5 7 8 7 12 0 5-3 8-7 8s-7-3-7-8c0-4 2-7 7-12z" fill={color} />
              )}
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}
