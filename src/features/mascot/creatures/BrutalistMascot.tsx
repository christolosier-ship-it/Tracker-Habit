import { useRef } from "react";
import type { MascotCreatureProps } from "../mascot.types";
import { useBrutalistReaction } from "./useBrutalistReaction";
import "./brutalist-mascot.css";

const pores = [
  [64, 57, 2.2], [88, 47, 1.6], [117, 55, 2], [145, 43, 1.5],
  [156, 72, 2.4], [72, 92, 1.5], [96, 104, 2.2], [137, 98, 1.6],
  [154, 125, 2], [82, 139, 1.8], [112, 150, 2.5], [143, 153, 1.4],
] as const;

const dust = [
  [40, 57], [63, 35], [101, 27], [151, 35], [182, 67],
  [190, 118], [170, 171], [126, 190], [76, 187], [35, 148],
] as const;

export function BrutalistMascot({ mood, reaction }: MascotCreatureProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  useBrutalistReaction(svgRef, reaction ?? null);

  return (
    <svg
      ref={svgRef}
      className="mascot-svg mascot-brutalist-pro"
      viewBox="0 0 220 220"
      aria-hidden="true"
      focusable="false"
      data-creature="concrete guardian"
      data-mood={mood}
      data-reaction={reaction ?? "none"}
    >
      <defs>
        <linearGradient id="brutalist-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b9b6ae" />
          <stop offset=".55" stopColor="#98958e" />
          <stop offset="1" stopColor="#77756f" />
        </linearGradient>
        <linearGradient id="brutalist-side" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6f6e69" />
          <stop offset="1" stopColor="#3e3f3d" />
        </linearGradient>
        <linearGradient id="brutalist-dark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#595955" />
          <stop offset="1" stopColor="#2d2e2c" />
        </linearGradient>
        <filter id="brutalist-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <g className="brutalist-rig">
        <ellipse cx="110" cy="200" rx="60" ry="8" fill="#111" opacity=".18" filter="url(#brutalist-shadow)" />

        <g className="brutalist-leg-left-motion" data-gsap>
          <g className="brutalist-leg-left">
            <rect x="68" y="150" width="25" height="38" rx="3" fill="url(#brutalist-dark)" />
            <path d="M52 183h50v18H48c0-8 1-13 4-18z" fill="url(#brutalist-front)" stroke="#555651" strokeWidth="3" />
          </g>
        </g>
        <g className="brutalist-leg-right-motion" data-gsap>
          <g className="brutalist-leg-right">
            <rect x="128" y="150" width="25" height="38" rx="3" fill="url(#brutalist-dark)" />
            <path d="M119 183h50c3 5 4 10 4 18h-54z" fill="url(#brutalist-front)" stroke="#555651" strokeWidth="3" />
          </g>
        </g>

        <g className="brutalist-arm-left-motion" data-gsap>
          <g className="brutalist-arm-left">
            <path d="M51 88l-20 18 13 37 20-8-8-31z" fill="url(#brutalist-side)" stroke="#424340" strokeWidth="3" />
            <path d="M23 132l27-10 14 28-10 20-25-3-10-20z" fill="url(#brutalist-front)" stroke="#444541" strokeWidth="3" />
            <path d="M31 159v11M42 156v14M53 151v16" stroke="#353633" strokeWidth="4" strokeLinecap="round" />
          </g>
        </g>
        <g className="brutalist-arm-right-motion" data-gsap>
          <g className="brutalist-arm-right">
            <path d="M169 88l20 18-13 37-20-8 8-31z" fill="url(#brutalist-side)" stroke="#424340" strokeWidth="3" />
            <path d="M197 132l-27-10-14 28 10 20 25-3 10-20z" fill="url(#brutalist-front)" stroke="#444541" strokeWidth="3" />
            <path d="M189 159v11M178 156v14M167 151v16" stroke="#353633" strokeWidth="4" strokeLinecap="round" />
          </g>
        </g>

        <g className="brutalist-body-motion" data-gsap>
          <g className="brutalist-body">
            <path d="M52 35l24-17h104l-14 17z" fill="#c8c4ba" stroke="#6d6d68" strokeWidth="3" />
            <path d="M52 35l24-17v132l-24 18z" fill="url(#brutalist-side)" stroke="#4e4f4c" strokeWidth="3" />
            <rect x="52" y="35" width="114" height="133" rx="4" fill="url(#brutalist-front)" stroke="#565752" strokeWidth="3" />
            <ellipse cx="91" cy="56" rx="28" ry="10" fill="#fff" opacity=".11" transform="rotate(-12 91 56)" />

            {pores.map(([x, y, r], index) => (
              <circle className="brutalist-pore" key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#555650" opacity=".5" style={{ animationDelay: `${-index * .13}s` }} />
            ))}
            <circle cx="70" cy="69" r="3.4" fill="#555650" opacity=".7" />
            <circle cx="151" cy="145" r="3" fill="#d2cec4" opacity=".5" />

            <g className="brutalist-face brutalist-face-neutral">
              <rect x="80" y="90" width="18" height="25" rx="2" fill="#20211f" />
              <rect x="121" y="90" width="18" height="25" rx="2" fill="#20211f" />
              <path d="M76 82l27 10M143 82l-27 10" stroke="#343532" strokeWidth="7" strokeLinecap="square" />
              <path d="M99 137q11-8 22 0" fill="none" stroke="#292a28" strokeWidth="5" strokeLinecap="round" />
            </g>
            <g className="brutalist-face brutalist-face-happy">
              <path d="M78 103q11-11 22 0M119 103q11-11 22 0" fill="none" stroke="#20211f" strokeWidth="6" strokeLinecap="square" />
              <path d="M96 132q14 15 28 0" fill="#333432" stroke="#20211f" strokeWidth="4" />
            </g>
            <g className="brutalist-face brutalist-face-celebrate">
              <path d="M76 101l11 6 11-6M121 101l11 6 11-6" fill="none" stroke="#20211f" strokeWidth="6" strokeLinecap="square" />
              <rect x="98" y="129" width="24" height="16" rx="3" fill="#2b2c2a" />
            </g>
            <g className="brutalist-face brutalist-face-worried">
              <rect x="81" y="94" width="17" height="22" rx="2" fill="#20211f" />
              <rect x="121" y="94" width="17" height="22" rx="2" fill="#20211f" />
              <path d="M77 86l23-7M142 86l-23-7" stroke="#343532" strokeWidth="7" />
              <path d="M98 140q12-10 24 0" fill="none" stroke="#292a28" strokeWidth="5" strokeLinecap="round" />
            </g>
            <g className="brutalist-face brutalist-face-sleepy">
              <path d="M78 104h23M118 104h23" stroke="#20211f" strokeWidth="6" strokeLinecap="square" />
              <path d="M101 137h18" stroke="#292a28" strokeWidth="5" strokeLinecap="round" />
            </g>
          </g>
        </g>

        <g className="brutalist-dust" data-gsap>
          {dust.map(([x, y], index) => (
            <rect className="brutalist-dust-particle" key={`${x}-${y}`} x={x - 3} y={y - 3} width="6" height="6" fill={index % 2 ? "#6e6e68" : "#aaa79f"} transform={`rotate(${index * 17} ${x} ${y})`} />
          ))}
        </g>
      </g>
    </svg>
  );
}
