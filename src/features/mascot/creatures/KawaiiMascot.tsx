import { useRef } from "react";
import type { MascotCreatureProps } from "../mascot.types";
import { useKawaiiReaction } from "./useKawaiiReaction";
import "./kawaii-mascot.css";

const burst = [
  [39, 54, "#ffd66b", "star"], [66, 32, "#b8a8ff", "flower"],
  [105, 24, "#ffd66b", "star"], [151, 35, "#8eddf3", "cloud"],
  [181, 67, "#ff88b6", "flower"], [188, 121, "#ffd66b", "star"],
  [167, 170, "#b8a8ff", "flower"], [119, 190, "#8eddf3", "cloud"],
  [66, 181, "#ff88b6", "flower"], [31, 143, "#ffd66b", "star"],
] as const;

function Flower({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse key={angle} cx="0" cy="-5" rx="4" ry="6" fill={color} transform={`rotate(${angle})`} />
      ))}
      <circle r="3" fill="#ffe27a" />
    </g>
  );
}

export function KawaiiMascot({ mood, reaction }: MascotCreatureProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  useKawaiiReaction(svgRef, reaction ?? null);

  return (
    <svg
      ref={svgRef}
      className="mascot-svg mascot-kawaii-pro"
      viewBox="0 0 220 220"
      aria-hidden="true"
      focusable="false"
      data-creature="kawaii flower bear"
      data-mood={mood}
      data-reaction={reaction ?? "none"}
    >
      <defs>
        <radialGradient id="kawaii-fur" cx="35%" cy="24%" r="82%">
          <stop offset="0" stopColor="#ffb8d1" />
          <stop offset="0.58" stopColor="#f789b1" />
          <stop offset="1" stopColor="#dd5f93" />
        </radialGradient>
        <radialGradient id="kawaii-limb" cx="36%" cy="24%" r="82%">
          <stop offset="0" stopColor="#ffb0cb" />
          <stop offset="1" stopColor="#dd5f93" />
        </radialGradient>
        <linearGradient id="kawaii-cloud" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d8f7ff" />
          <stop offset="1" stopColor="#82c9e6" />
        </linearGradient>
        <filter id="kawaii-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <g className="kawaii-rig">
        <ellipse cx="110" cy="198" rx="58" ry="8" fill="#6f4161" opacity="0.16" filter="url(#kawaii-shadow)" />

        <g className="kawaii-ear-left-motion" data-gsap>
          <g className="kawaii-ear-left">
            <circle cx="72" cy="52" r="28" fill="url(#kawaii-fur)" stroke="#d45289" strokeWidth="3" />
            <circle cx="72" cy="53" r="15" fill="#ffd8df" opacity="0.82" />
          </g>
        </g>
        <g className="kawaii-ear-right-motion" data-gsap>
          <g className="kawaii-ear-right">
            <circle cx="149" cy="52" r="28" fill="url(#kawaii-fur)" stroke="#d45289" strokeWidth="3" />
            <circle cx="149" cy="53" r="15" fill="#ffd8df" opacity="0.82" />
          </g>
        </g>

        <g className="kawaii-leg-left-motion" data-gsap>
          <g className="kawaii-leg-left">
            <path d="M77 157c-4 9-7 19-6 29" fill="none" stroke="#dc6594" strokeWidth="22" strokeLinecap="round" />
            <ellipse cx="73" cy="190" rx="24" ry="15" fill="url(#kawaii-limb)" stroke="#ce4f83" strokeWidth="3" />
            <ellipse cx="66" cy="185" rx="8" ry="4" fill="#fff" opacity="0.24" />
          </g>
        </g>
        <g className="kawaii-leg-right-motion" data-gsap>
          <g className="kawaii-leg-right">
            <path d="M143 157c4 9 7 19 6 29" fill="none" stroke="#dc6594" strokeWidth="22" strokeLinecap="round" />
            <ellipse cx="147" cy="190" rx="24" ry="15" fill="url(#kawaii-limb)" stroke="#ce4f83" strokeWidth="3" />
            <ellipse cx="140" cy="185" rx="8" ry="4" fill="#fff" opacity="0.24" />
          </g>
        </g>

        <g className="kawaii-arm-left-motion" data-gsap>
          <g className="kawaii-arm-left">
            <path d="M58 111c-15 8-21 22-17 37" fill="none" stroke="#e66f9e" strokeWidth="22" strokeLinecap="round" />
            <ellipse cx="42" cy="151" rx="15" ry="18" fill="url(#kawaii-limb)" stroke="#ce4f83" strokeWidth="3" />
          </g>
        </g>
        <g className="kawaii-arm-right-motion" data-gsap>
          <g className="kawaii-arm-right">
            <path d="M162 111c15 8 21 22 17 37" fill="none" stroke="#e66f9e" strokeWidth="22" strokeLinecap="round" />
            <ellipse cx="178" cy="151" rx="15" ry="18" fill="url(#kawaii-limb)" stroke="#ce4f83" strokeWidth="3" />
            <g className="kawaii-decoration">
              <path d="M171 151c-7-4-5-12 1-13-2-7 7-11 11-5 5-5 13 1 10 7 7 2 7 11 1 14 1 7-8 10-12 5-5 5-13-1-11-8z" fill="url(#kawaii-cloud)" stroke="#6eb8d8" strokeWidth="2" />
            </g>
          </g>
        </g>

        <g className="kawaii-body-motion" data-gsap>
          <g className="kawaii-body">
            <path d="M110 42c45 0 72 29 72 76 0 40-25 64-72 64s-72-24-72-64c0-47 27-76 72-76z" fill="url(#kawaii-fur)" stroke="#d45289" strokeWidth="3" />
            <ellipse cx="84" cy="69" rx="27" ry="11" fill="#fff" opacity="0.24" transform="rotate(-20 84 69)" />

            <g className="kawaii-decoration"><Flower x={65} y={73} color="#b8a8ff" /></g>
            <g className="kawaii-decoration"><Flower x={148} y={76} color="#ffd25f" /></g>
            <g className="kawaii-decoration" transform="translate(111 57)">
              <path d="M0-10l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="#ffd66b" stroke="#e6a941" strokeWidth="1.5" />
            </g>
            <g className="kawaii-decoration" transform="translate(163 94)">
              <path d="M0-7l2 5 6 1-4 4 1 6-5-3-5 3 1-6-4-4 6-1z" fill="#a8b9ef" stroke="#7587c7" strokeWidth="1.4" />
            </g>

            <g className="kawaii-face-motion" data-gsap>
              <g className="kawaii-face kawai-face-neutral">
                <ellipse cx="82" cy="112" rx="13" ry="18" fill="#29152d" />
                <ellipse cx="138" cy="112" rx="13" ry="18" fill="#29152d" />
                <ellipse className="kawaii-eye-shine" cx="78" cy="105" rx="5" ry="7" fill="#fff" />
                <ellipse className="kawaii-eye-shine" cx="134" cy="105" rx="5" ry="7" fill="#fff" />
              </g>
              <g className="kawaii-face kawai-face-happy">
                <path d="M69 111q13-14 26 0M125 111q13-14 26 0" fill="none" stroke="#29152d" strokeWidth="5" strokeLinecap="round" />
              </g>
              <g className="kawaii-face kawai-face-celebrate">
                <path d="M69 110q13-15 26 0M125 110q13-15 26 0" fill="none" stroke="#29152d" strokeWidth="5" strokeLinecap="round" />
                <path d="M99 135q11 12 22 0" fill="#b84d77" stroke="#6f274a" strokeWidth="2.5" />
              </g>
              <g className="kawaii-face kawai-face-worried">
                <ellipse cx="82" cy="113" rx="11" ry="15" fill="#29152d" />
                <ellipse cx="138" cy="113" rx="11" ry="15" fill="#29152d" />
                <path d="M70 94l18-5M132 89l18 5" stroke="#6f274a" strokeWidth="4" strokeLinecap="round" />
              </g>
              <g className="kawaii-face kawai-face-sleepy">
                <path d="M69 112h26M125 112h26" stroke="#29152d" strokeWidth="5" strokeLinecap="round" />
              </g>

              <ellipse cx="69" cy="132" rx="13" ry="10" fill="#ff6f9e" opacity="0.72" />
              <ellipse cx="151" cy="132" rx="13" ry="10" fill="#ff6f9e" opacity="0.72" />
              <ellipse cx="110" cy="125" rx="25" ry="21" fill="#ffe6dc" opacity="0.95" />
              <path d="M102 120q8-8 16 0-1 8-8 8t-8-8z" fill="#8d305f" stroke="#6f274a" strokeWidth="2" />
              <path d="M110 128v5M110 133q-8 10-14 0M110 133q8 10 14 0" fill="none" stroke="#6f274a" strokeWidth="3" strokeLinecap="round" />
            </g>
          </g>
        </g>

        <g className="kawaii-burst" data-gsap>
          {burst.map(([x, y, color, shape], index) => (
            <g className="kawaii-burst-particle" key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${index * 19})`}>
              {shape === "star" ? (
                <path d="M0-7l2 5 6 1-4 4 1 6-5-3-5 3 1-6-4-4 6-1z" fill={color} />
              ) : shape === "cloud" ? (
                <path d="M-8 2c-2-5 3-9 7-6 2-6 11-4 11 2 6 0 7 8 1 10H-3c-5 0-8-3-5-6z" fill={color} />
              ) : (
                <Flower x={0} y={0} color={color} />
              )}
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}