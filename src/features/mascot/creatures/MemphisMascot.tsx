import { useRef } from "react";
import type { MascotCreatureProps } from "../mascot.types";
import { useMemphisReaction } from "./useMemphisReaction";
import "./memphis-mascot.css";

const polkaDots = [
  [53, 123], [67, 117], [82, 125], [48, 138], [64, 145],
  [82, 139], [55, 156], [73, 160], [88, 151],
] as const;

const burstShapes = [
  [39, 44, "circle", "#ff3b30"],
  [67, 26, "triangle", "#1565d8"],
  [103, 21, "line", "#111111"],
  [141, 29, "circle", "#ffbf00"],
  [177, 49, "triangle", "#ff3b30"],
  [193, 84, "line", "#1565d8"],
  [189, 145, "circle", "#111111"],
  [159, 184, "triangle", "#ffbf00"],
  [96, 193, "line", "#ff3b30"],
  [43, 177, "circle", "#1565d8"],
] as const;

export function MemphisMascot({ mood, reaction }: MascotCreatureProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  useMemphisReaction(svgRef, reaction ?? null);

  return (
    <svg
      ref={svgRef}
      className="mascot-svg mascot-memphis-pro"
      viewBox="0 0 220 220"
      aria-hidden="true"
      focusable="false"
      data-creature="living memphis geometry pro"
      data-mood={mood}
      data-reaction={reaction ?? "none"}
    >
      <defs>
        <linearGradient id="memphis-yellow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd22d" />
          <stop offset="0.5" stopColor="#ffb500" />
          <stop offset="1" stopColor="#ee8f00" />
        </linearGradient>
        <linearGradient id="memphis-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2469e8" />
          <stop offset="0.55" stopColor="#0649c5" />
          <stop offset="1" stopColor="#07338f" />
        </linearGradient>
        <linearGradient id="memphis-red" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff5547" />
          <stop offset="0.55" stopColor="#ff2d20" />
          <stop offset="1" stopColor="#d91d13" />
        </linearGradient>
        <linearGradient id="memphis-black" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a2a2a" />
          <stop offset="0.48" stopColor="#0a0a0a" />
          <stop offset="1" stopColor="#000000" />
        </linearGradient>
        <linearGradient id="memphis-glove" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.65" stopColor="#f4eee3" />
          <stop offset="1" stopColor="#d8cbbb" />
        </linearGradient>
        <filter id="memphis-shadow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <g className="memphis-rig">
        <ellipse
          cx="111"
          cy="202"
          rx="55"
          ry="7"
          fill="#202020"
          opacity="0.16"
          filter="url(#memphis-shadow)"
        />

        <g className="memphis-leg-left-motion" data-gsap>
          <g className="memphis-leg memphis-leg-left">
            <path
              d="M89 152l-4 38"
              fill="none"
              stroke="url(#memphis-black)"
              strokeWidth="18"
              strokeLinecap="square"
            />
            <path
              d="M58 188h47v18H58z"
              fill="url(#memphis-red)"
              stroke="#b81a12"
              strokeWidth="2.5"
            />
            <path d="M58 202h47v6H58z" fill="#111" />
            <path className="memphis-accent-line" d="M66 190h30" stroke="#ff8b80" strokeWidth="2" opacity="0.55" />
          </g>
        </g>

        <g className="memphis-leg-right-motion" data-gsap>
          <g className="memphis-leg memphis-leg-right">
            <path
              d="M137 151l17 38"
              fill="none"
              stroke="url(#memphis-black)"
              strokeWidth="18"
              strokeLinecap="square"
            />
            <path d="M140 157l10 17M148 175l10 17M154 190l8 14" stroke="#f7efe4" strokeWidth="7" />
            <path
              d="M139 188h43c10 0 17 8 17 17v2h-60z"
              fill="url(#memphis-black)"
              stroke="#050505"
              strokeWidth="2.5"
            />
            <path d="M139 202h60v6h-60z" fill="#111" />
          </g>
        </g>

        <g className="memphis-arm-left-motion" data-gsap>
          <g className="memphis-arm memphis-arm-left">
            <path
              d="M68 102c-17 2-27 17-25 36 1 13 8 24 18 31"
              fill="none"
              stroke="url(#memphis-black)"
              strokeWidth="17"
              strokeLinecap="round"
            />
            <path
              d="M54 153c-11-2-18 7-17 17 1 10 9 16 19 14 8-2 13-9 12-17-1-7-6-12-14-14z"
              fill="url(#memphis-glove)"
              stroke="#c6b8a7"
              strokeWidth="2"
            />
          </g>
        </g>

        <g className="memphis-arm-right-motion" data-gsap>
          <g className="memphis-arm memphis-arm-right">
            <path
              d="M155 104c19 1 29-14 35-34"
              fill="none"
              stroke="url(#memphis-black)"
              strokeWidth="17"
              strokeLinecap="round"
            />
            <g className="memphis-glove-motion" data-gsap>
              <g className="memphis-glove">
                <path
                  d="M179 67c-7-8-9-19-4-25 3-4 7-2 9 3-1-9 1-17 6-18 5-1 7 6 7 13 1-10 4-17 9-16 5 1 5 8 4 15 3-8 7-12 11-10 5 3 2 11-1 17 5-5 10-5 12-1 4 7-6 20-16 27-13 8-27 6-37-5z"
                  fill="url(#memphis-glove)"
                  stroke="#c6b8a7"
                  strokeWidth="2"
                />
                <path d="M184 54c8 5 18 6 27 3" fill="none" stroke="#d7cab9" strokeWidth="2" strokeLinecap="round" />
              </g>
            </g>
          </g>
        </g>

        <g className="memphis-body-motion" data-gsap>
          <g className="memphis-body">
            <rect x="67" y="90" width="91" height="43" rx="3" fill="url(#memphis-blue)" stroke="#043a9e" strokeWidth="3" />
            <rect x="91" y="132" width="67" height="39" rx="2" fill="url(#memphis-red)" stroke="#c51e15" strokeWidth="3" />
            <path d="M67 132h24v39H67z" fill="#fffaf1" stroke="#ddd2c4" strokeWidth="2" />
            {polkaDots.map(([x, y], index) => (
              <circle
                className="memphis-dot"
                key={`${x}-${y}`}
                cx={x}
                cy={y}
                r="4.2"
                fill="#111"
                style={{ animationDelay: `${-index * 0.16}s` }}
              />
            ))}
            <path className="memphis-accent-line" d="M72 96h80" stroke="#64a0ff" strokeWidth="2" opacity="0.5" />
            <path className="memphis-accent-line" d="M97 138h55" stroke="#ff8178" strokeWidth="2" opacity="0.45" />
          </g>
        </g>

        <g className="memphis-head-motion" data-gsap>
          <g className="memphis-head">
            <path
              d="M83 89c-6-12-7-29-3-44 5-20 21-32 42-31 19 1 34 15 37 34 3 17-2 31-11 41z"
              fill="#e58c00"
              stroke="#d57c00"
              strokeWidth="3"
            />
            <circle cx="122" cy="55" r="40" fill="url(#memphis-yellow)" stroke="#ee9c00" strokeWidth="3" />
            <ellipse cx="106" cy="34" rx="17" ry="8" fill="#fff" opacity="0.22" transform="rotate(-24 106 34)" />

            <g className="memphis-face-motion" data-gsap>
              <g className="memphis-face memphis-face-neutral">
                <ellipse cx="108" cy="53" rx="6" ry="12" fill="#101010" />
                <ellipse cx="136" cy="53" rx="6" ry="12" fill="#101010" />
                <path d="M110 68q12 14 25 0" fill="#151515" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M119 76q7 4 12 0" fill="none" stroke="#ff4a3f" strokeWidth="4" strokeLinecap="round" />
              </g>

              <g className="memphis-face memphis-face-happy">
                <path d="M100 52q8-9 16 0M128 52q8-9 16 0" fill="none" stroke="#111" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M108 67q14 19 28 0" fill="#151515" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M117 77q8 5 14 0" fill="none" stroke="#ff4a3f" strokeWidth="4" strokeLinecap="round" />
              </g>

              <g className="memphis-face memphis-face-worried">
                <ellipse cx="108" cy="55" rx="5.5" ry="10" fill="#101010" />
                <ellipse cx="136" cy="55" rx="5.5" ry="10" fill="#101010" />
                <path d="M101 39l12-4M131 35l12 4" stroke="#111" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M113 75q9-8 18 0" fill="none" stroke="#111" strokeWidth="3.5" strokeLinecap="round" />
              </g>

              <g className="memphis-face memphis-face-sleepy">
                <path d="M100 55h16M128 55h16" stroke="#111" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M116 73q7 4 14 0" fill="none" stroke="#111" strokeWidth="3.5" strokeLinecap="round" />
              </g>

              <g className="memphis-star-eyes">
                <path d="M108 42l3 7 7 3-7 3-3 7-3-7-7-3 7-3zM136 42l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#111" />
                <path d="M108 68q14 17 28 0" fill="#151515" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            </g>
          </g>
        </g>

        <g className="memphis-burst" data-gsap>
          {burstShapes.map(([x, y, kind, color], index) => {
            if (kind === "circle") {
              return <circle className="memphis-burst-particle" key={`${x}-${y}`} cx={x} cy={y} r="4.5" fill={color} />;
            }
            if (kind === "triangle") {
              return (
                <path
                  className="memphis-burst-particle"
                  key={`${x}-${y}`}
                  d={`M${x} ${Number(y) - 6}l6 11h-12z`}
                  fill={color}
                />
              );
            }
            return (
              <path
                className="memphis-burst-particle"
                key={`${x}-${y}`}
                d={`M${Number(x) - 6} ${Number(y) - 3}l12 6`}
                stroke={color}
                strokeWidth="5"
                strokeLinecap="round"
                transform={`rotate(${index * 19} ${x} ${y})`}
              />
            );
          })}
        </g>
      </g>
    </svg>
  );
}
