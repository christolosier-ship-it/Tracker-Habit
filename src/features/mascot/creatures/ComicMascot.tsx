import { useRef } from "react";
import type { MascotCreatureProps } from "../mascot.types";
import { comicReactions } from "./comic-reactions";
import { useGsapReactionRuntime } from "../gsap-runtime";
import "./comic-mascot.css";

const burst = [
  [28, 45, "#ffd21f"], [48, 24, "#ef2d25"], [98, 19, "#2b74d8"], [168, 37, "#ffd21f"],
  [194, 82, "#ef2d25"], [187, 153, "#2b74d8"], [142, 194, "#ffd21f"], [72, 192, "#ef2d25"],
  [27, 151, "#2b74d8"], [17, 93, "#ffd21f"],
] as const;

export function ComicMascot({ mood, reaction, onReactionComplete }: MascotCreatureProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  useGsapReactionRuntime(
    svgRef, reaction ?? null, comicReactions.play, comicReactions.reset, onReactionComplete,
  );

  return (
    <svg
      ref={svgRef}
      className="mascot-svg mascot-comic-pro"
      viewBox="0 0 220 220"
      aria-hidden="true"
      focusable="false"
      data-creature="comic book hero"
      data-mood={mood}
      data-reaction={reaction ?? "none"}
    >
      <defs>
        <linearGradient id="comic-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a86e6" /><stop offset="1" stopColor="#0759b4" />
        </linearGradient>
        <linearGradient id="comic-red" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff4737" /><stop offset="1" stopColor="#b50f18" />
        </linearGradient>
        <linearGradient id="comic-skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd19a" /><stop offset="1" stopColor="#e88f54" />
        </linearGradient>
        <filter id="comic-shadow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" /></filter>
      </defs>

      <g className="comic-rig">
        <ellipse cx="111" cy="202" rx="63" ry="8" fill="#122034" opacity=".16" filter="url(#comic-shadow)" />

        <g className="comic-cape-motion" data-gsap>
          <path className="comic-cape" d="M83 84C50 80 24 96 18 134c15-11 28-6 37 9 14 22 40 22 62 5l-5-54z" fill="url(#comic-red)" stroke="#731018" strokeWidth="4" />
          <path d="M82 89c-25 5-42 18-50 37 14-7 26 0 36 15 11 16 28 17 43 8" fill="none" stroke="#ff6b58" strokeWidth="5" opacity=".55" />
        </g>

        <g className="comic-leg-left-motion" data-gsap><g className="comic-leg-left">
          <path d="M88 153l-9 31" stroke="#0754a7" strokeWidth="20" strokeLinecap="round" />
          <path d="M73 179l28 1-3 19H65z" fill="url(#comic-red)" stroke="#7a1019" strokeWidth="4" />
        </g></g>
        <g className="comic-leg-right-motion" data-gsap><g className="comic-leg-right">
          <path d="M132 153l9 31" stroke="#0754a7" strokeWidth="20" strokeLinecap="round" />
          <path d="M119 180l28-1 8 20h-33z" fill="url(#comic-red)" stroke="#7a1019" strokeWidth="4" />
        </g></g>

        <g className="comic-body-motion" data-gsap><g className="comic-body">
          <path d="M74 95c12-13 60-13 72 0 12 16 13 48 2 69-13 17-63 17-76 0-11-21-10-53 2-69z" fill="url(#comic-blue)" stroke="#063f7f" strokeWidth="4" />
          <path d="M91 96h38l-19 13z" fill="#9f111b" stroke="#711016" strokeWidth="3" />
          <g className="comic-star-motion" data-gsap>
            <path className="comic-star" d="M110 106l8 16 18 3-13 12 3 18-16-9-16 9 3-18-13-12 18-3z" fill="#ffd21f" stroke="#8f6200" strokeWidth="3" />
          </g>
          <path d="M80 155h60" stroke="#1d2028" strokeWidth="8" /><rect x="101" y="149" width="20" height="15" rx="3" fill="#ffd21f" stroke="#8f6200" strokeWidth="3" />
        </g></g>

        <g className="comic-arm-left-motion" data-gsap><g className="comic-arm-left">
          <path d="M76 106c-15 5-20 17-19 31" fill="none" stroke="#1469c5" strokeWidth="18" strokeLinecap="round" />
          <circle cx="57" cy="140" r="13" fill="#20242c" stroke="#090b0f" strokeWidth="4" />
          <path d="M52 133l-2 13M58 132l1 14M64 134l3 10" stroke="#3c424c" strokeWidth="2.5" strokeLinecap="round" />
        </g></g>
        <g className="comic-arm-right-motion" data-gsap><g className="comic-arm-right">
          <path d="M144 106c15 5 20 17 19 31" fill="none" stroke="#1469c5" strokeWidth="18" strokeLinecap="round" />
          <circle cx="163" cy="140" r="13" fill="#20242c" stroke="#090b0f" strokeWidth="4" />
          <path d="M158 133l-2 13M164 132l1 14M170 134l3 10" stroke="#3c424c" strokeWidth="2.5" strokeLinecap="round" />
        </g></g>

        <g className="comic-head-motion" data-gsap><g className="comic-head">
          <path d="M71 40c6-20 24-29 38-26l-4 10c17-13 37-7 42 7l-12 1c10 6 15 16 10 28-5-9-13-13-22-12-18 2-34 1-52-8z" fill="#20242c" stroke="#090b0f" strokeWidth="4" />
          <circle cx="76" cy="65" r="13" fill="url(#comic-skin)" stroke="#8e4d2c" strokeWidth="3" /><circle cx="144" cy="65" r="13" fill="url(#comic-skin)" stroke="#8e4d2c" strokeWidth="3" />
          <path d="M72 47c9-13 67-13 76 0 8 11 6 32-4 43-14 15-54 15-68 0-10-11-12-32-4-43z" fill="url(#comic-skin)" stroke="#8e4d2c" strokeWidth="4" />
          <path d="M76 58q34-24 68 0v20q-34 18-68 0z" fill="#1a1d24" stroke="#e82424" strokeWidth="5" />
          <g className="comic-face comic-face-neutral">
            <ellipse cx="95" cy="69" rx="10" ry="8" fill="#fff" /><ellipse cx="125" cy="69" rx="10" ry="8" fill="#fff" />
            <circle cx="98" cy="69" r="4" fill="#111" /><circle cx="122" cy="69" r="4" fill="#111" />
            <circle className="comic-eye-shine" cx="99" cy="67" r="1.4" fill="#fff" /><circle className="comic-eye-shine" cx="123" cy="67" r="1.4" fill="#fff" />
            <path d="M99 89q11 7 22 0" fill="none" stroke="#5a2c25" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g className="comic-face comic-face-happy"><path d="M84 69q11-11 22 0M114 69q11-11 22 0" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" /><path d="M96 88q14 13 28 0" fill="#8c1a21" stroke="#5a2c25" strokeWidth="2.5" /></g>
          <g className="comic-face comic-face-celebrate"><path d="M84 68q11-12 22 0M114 68q11-12 22 0" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" /><path d="M95 87q15 16 30 0" fill="#a51f27" stroke="#5a2c25" strokeWidth="2.5" /></g>
          <g className="comic-face comic-face-worried"><ellipse cx="95" cy="69" rx="9" ry="7" fill="#fff" /><ellipse cx="125" cy="69" rx="9" ry="7" fill="#fff" /><circle cx="98" cy="70" r="3" /><circle cx="122" cy="70" r="3" /><path d="M98 93q12-8 24 0" fill="none" stroke="#5a2c25" strokeWidth="3" strokeLinecap="round" /></g>
          <g className="comic-face comic-face-sleepy"><path d="M85 70h20M115 70h20" stroke="#fff" strokeWidth="5" strokeLinecap="round" /><path d="M101 91h18" stroke="#5a2c25" strokeWidth="3" strokeLinecap="round" /></g>
        </g></g>

        <g className="comic-burst" data-gsap>
          {burst.map(([x, y, color], index) => <g key={`${x}-${y}`} className="comic-burst-particle" transform={`translate(${x} ${y}) rotate(${index * 17})`}><path d="M0-8l3 5 6-1-3 5 5 4-7 1-2 7-4-6-7 2 3-7-5-4 7-1z" fill={color} stroke="#1d2230" strokeWidth="1.5" /></g>)}
        </g>
      </g>
    </svg>
  );
}
