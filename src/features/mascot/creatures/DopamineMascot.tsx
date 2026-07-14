import { useRef } from "react";
import type { MascotCreatureProps } from "../mascot.types";
import { dopamineReactions } from "./dopamine-reactions";
import { useGsapReactionRuntime } from "../gsap-runtime";
import "./dopamine-mascot.css";

const sprinkles = [
  [63, 78, 12, -35, "#18bff2"],
  [92, 67, 10, 42, "#ff4f91"],
  [128, 68, 9, 18, "#ff4f91"],
  [155, 85, 11, 42, "#1bbdf2"],
  [172, 111, 10, 28, "#ff4f91"],
  [161, 144, 12, -28, "#ffb300"],
  [134, 158, 13, -22, "#1bbdf2"],
  [103, 168, 10, 8, "#ffb300"],
  [73, 156, 11, 26, "#ff4f91"],
  [52, 133, 10, 44, "#1bbdf2"],
  [45, 103, 9, 18, "#ffb300"],
  [53, 88, 7, 42, "#ff4f91"],
] as const;

export function DopamineMascot({ mood, reaction, onReactionComplete }: MascotCreatureProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  useGsapReactionRuntime(
    svgRef, reaction ?? null, dopamineReactions.play, dopamineReactions.reset, onReactionComplete,
  );

  return (
    <svg
      ref={svgRef}
      className="mascot-svg mascot-dopamine-pro"
      viewBox="0 0 220 220"
      aria-hidden="true"
      focusable="false"
      data-creature="sprinkle buddy pro"
      data-mood={mood}
      data-reaction={reaction ?? "none"}
    >
      <defs>
        <radialGradient id="dopamine-body" cx="38%" cy="28%" r="78%">
          <stop offset="0" stopColor="#fffdf3" />
          <stop offset="0.58" stopColor="#ffeac0" />
          <stop offset="1" stopColor="#e7b67f" />
        </radialGradient>
        <linearGradient id="dopamine-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#59d7ff" />
          <stop offset="0.48" stopColor="#159fe8" />
          <stop offset="1" stopColor="#0873c7" />
        </linearGradient>
        <linearGradient id="dopamine-pink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff75ab" />
          <stop offset="1" stopColor="#ee2f79" />
        </linearGradient>
        <linearGradient id="dopamine-yellow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd94c" />
          <stop offset="1" stopColor="#f5a400" />
        </linearGradient>
        <filter id="dopamine-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <g className="dopamine-rig">
        <ellipse cx="110" cy="199" rx="50" ry="8" fill="#78542f" opacity="0.18" filter="url(#dopamine-shadow)" />

        <g className="dopamine-leg-left-motion" data-gsap>
          <g className="dopamine-leg dopamine-leg-left">
            <path d="M82 161c-4 12-6 22-5 30" fill="none" stroke="#e6b275" strokeWidth="12" strokeLinecap="round" />
            <path d="M60 192c0-10 8-17 21-17 12 0 19 7 19 17 0 8-8 12-21 12-12 0-19-4-19-12z" fill="url(#dopamine-blue)" stroke="#0767b5" strokeWidth="2.5" />
          </g>
        </g>

        <g className="dopamine-leg-right-motion" data-gsap>
          <g className="dopamine-leg dopamine-leg-right">
            <path d="M139 161c4 12 6 22 5 30" fill="none" stroke="#e6b275" strokeWidth="12" strokeLinecap="round" />
            <path d="M124 192c0-10 8-17 21-17 12 0 19 7 19 17 0 8-8 12-21 12-12 0-19-4-19-12z" fill="url(#dopamine-blue)" stroke="#0767b5" strokeWidth="2.5" />
          </g>
        </g>

        <g className="dopamine-arm-left-motion" data-gsap>
          <g className="dopamine-arm dopamine-arm-left">
            <path d="M53 107c-12 7-19 18-23 30" fill="none" stroke="#e9b979" strokeWidth="13" strokeLinecap="round" />
            <path d="M17 142c0-10 8-18 18-18 9 0 16 7 16 16 0 11-7 19-18 19-9 0-16-7-16-17z" fill="url(#dopamine-blue)" stroke="#0767b5" strokeWidth="2.5" />
          </g>
        </g>

        <g className="dopamine-arm-right-motion" data-gsap>
          <g className="dopamine-arm dopamine-arm-right">
            <path d="M166 104c12-7 19-20 22-32" fill="none" stroke="#159fe8" strokeWidth="15" strokeLinecap="round" />
            <path d="M184 77c-6-8-3-20 5-25 4-2 7 0 8 4 1-7 5-11 9-10 4 1 4 6 3 10 4-5 9-6 12-3 4 4 0 10-4 14 4-1 8 2 8 6 0 8-11 17-22 17-8 0-14-5-19-13z" fill="url(#dopamine-blue)" stroke="#0767b5" strokeWidth="2.5" />
          </g>
        </g>

        <g className="dopamine-tuft-motion" data-gsap>
          <g className="dopamine-tuft">
            <path d="M94 53C76 47 66 37 67 25c1-9 9-14 17-11 12 5 18 20 18 36" fill="url(#dopamine-yellow)" stroke="#ec9800" strokeWidth="2" />
            <path d="M107 50c-6-19-5-35 5-44 8-7 19-4 22 6 4 14-5 29-17 42" fill="url(#dopamine-pink)" stroke="#d92769" strokeWidth="2" />
            <path d="M119 53c8-18 20-29 34-28 10 1 14 10 9 18-7 12-24 15-43 17" fill="url(#dopamine-blue)" stroke="#0b78ca" strokeWidth="2" />
          </g>
        </g>

        <g className="dopamine-body-motion" data-gsap>
          <g className="dopamine-body">
            <circle cx="110" cy="116" r="67" fill="url(#dopamine-body)" stroke="#d59d67" strokeWidth="3" />
            <ellipse cx="87" cy="82" rx="28" ry="13" fill="#fff" opacity="0.36" transform="rotate(-24 87 82)" />

            {sprinkles.map(([x, y, length, angle, color], index) => (
              <rect
                className="dopamine-sprinkle"
                key={`${x}-${y}`}
                x={x - length / 2}
                y={y - 3.5}
                width={length}
                height="7"
                rx="3.5"
                fill={color}
                stroke="rgba(0,0,0,.12)"
                strokeWidth="1"
                transform={`rotate(${angle} ${x} ${y})`}
                style={{ animationDelay: `${-index * 0.17}s` }}
              />
            ))}

            <g className="dopamine-face-motion" data-gsap>
              <g className="dopamine-face dopamine-face-neutral">
                <ellipse cx="88" cy="111" rx="12" ry="17" fill="#111" />
                <ellipse cx="132" cy="111" rx="12" ry="17" fill="#111" />
                <ellipse className="dopamine-eye-shine" cx="84" cy="105" rx="4" ry="6" fill="#fff" />
                <ellipse className="dopamine-eye-shine" cx="128" cy="105" rx="4" ry="6" fill="#fff" />
                <path d="M95 133q15 15 30 0" fill="#8f1830" stroke="#5d1020" strokeWidth="3" strokeLinecap="round" />
              </g>

              <g className="dopamine-face dopamine-face-happy">
                <path d="M76 110q12-13 24 0M120 110q12-13 24 0" fill="none" stroke="#171717" strokeWidth="5" strokeLinecap="round" />
                <path d="M92 130q18 23 36 0" fill="#a9213c" stroke="#5d1020" strokeWidth="3" strokeLinecap="round" />
              </g>

              <g className="dopamine-face dopamine-face-worried">
                <ellipse cx="88" cy="113" rx="10" ry="14" fill="#111" />
                <ellipse cx="132" cy="113" rx="10" ry="14" fill="#111" />
                <path d="M78 94l17-5M125 89l17 5" stroke="#171717" strokeWidth="4" strokeLinecap="round" />
                <path d="M98 139q12-10 24 0" fill="none" stroke="#5d1020" strokeWidth="4" strokeLinecap="round" />
              </g>

              <g className="dopamine-face dopamine-face-sleepy">
                <path d="M77 112h22M121 112h22" stroke="#171717" strokeWidth="5" strokeLinecap="round" />
                <path d="M101 137q9 5 18 0" fill="none" stroke="#5d1020" strokeWidth="4" strokeLinecap="round" />
              </g>

              <g className="dopamine-star-eyes">
                <path d="M88 96l4 9 9 4-9 4-4 9-4-9-9-4 9-4zM132 96l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" fill="#191919" />
              </g>

              <circle cx="74" cy="132" r="10" fill="#ff6797" opacity="0.88" />
              <circle cx="146" cy="132" r="10" fill="#ff6797" opacity="0.88" />
            </g>
          </g>
        </g>

        <g className="dopamine-sprinkle-burst" data-gsap>
          {[
            [46, 56, "#ff4f91"], [72, 40, "#18bff2"], [101, 31, "#ffb300"],
            [137, 37, "#ff4f91"], [169, 57, "#18bff2"], [183, 91, "#ffb300"],
            [174, 158, "#ff4f91"], [142, 181, "#18bff2"], [76, 180, "#ffb300"],
            [42, 157, "#18bff2"],
          ].map(([x, y, color], index) => (
            <rect
              className="dopamine-burst-particle"
              key={`${x}-${y}`}
              x={Number(x) - 4}
              y={Number(y) - 2}
              width="8"
              height="4"
              rx="2"
              fill={String(color)}
              transform={`rotate(${index * 27} ${x} ${y})`}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}
