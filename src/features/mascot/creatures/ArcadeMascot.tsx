import { useRef } from "react";
import type { MascotCreatureProps } from "../mascot.types";
import { useArcadeReaction } from "./useArcadeReaction";
import "./arcade-mascot.css";

const bodyPixels = [
  [66, 34], [88, 26], [110, 22], [132, 26], [154, 34],
  [54, 46], [166, 46], [46, 62], [174, 62], [40, 82], [180, 82],
] as const;

const burstPixels = [
  [40, 50, "#3ef4ff"], [67, 30, "#2154ff"], [103, 20, "#ffffff"],
  [143, 28, "#3ef4ff"], [178, 54, "#2154ff"], [190, 92, "#ffffff"],
  [174, 151, "#3ef4ff"], [137, 185, "#2154ff"], [82, 186, "#ffffff"],
  [43, 157, "#3ef4ff"], [26, 107, "#2154ff"],
] as const;

export function ArcadeMascot({ mood, reaction }: MascotCreatureProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  useArcadeReaction(svgRef, reaction ?? null);

  return (
    <svg
      ref={svgRef}
      className="mascot-svg mascot-arcade-pro"
      viewBox="0 0 220 220"
      aria-hidden="true"
      focusable="false"
      data-creature="pixel ghost pro"
      data-mood={mood}
      data-reaction={reaction ?? "none"}
    >
      <defs>
        <linearGradient id="arcade-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#55f4ff" />
          <stop offset="0.58" stopColor="#18cedd" />
          <stop offset="1" stopColor="#0aa2c0" />
        </linearGradient>
        <linearGradient id="arcade-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1f61ff" />
          <stop offset="1" stopColor="#071b78" />
        </linearGradient>
        <filter id="arcade-blur" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <clipPath id="arcade-screen-clip">
          <path d="M46 82V62h8V46h12V34h22v-8h44v8h22v12h12v16h8v20h6v92h-12v-12h-22v12h-24v-12H98v12H74v-12H52v12H40V82z" />
        </clipPath>
      </defs>

      <g className="arcade-rig">
        <ellipse cx="110" cy="195" rx="52" ry="9" fill="#1230a0" opacity="0.18" filter="url(#arcade-blur)" />

        <g className="arcade-glow-motion" data-gsap>
          <path className="arcade-glow" d="M40 82V62h8V46h12V34h22v-8h56v8h22v12h12v16h8v20h6v92h-18v-12h-22v12h-24v-12H98v12H74v-12H52v12H34V82z" fill="#37e9ff" opacity="0.35" filter="url(#arcade-blur)" />
        </g>

        <g className="arcade-body-motion" data-gsap>
          <g className="arcade-body">
            <path d="M40 82V62h8V46h12V34h22v-8h56v8h22v12h12v16h8v20h6v92h-18v-12h-22v12h-24v-12H98v12H74v-12H52v12H34V82z" fill="url(#arcade-edge)" />
            <path d="M48 82V64h8V50h12V40h20v-8h44v8h20v10h12v14h8v18h6v80h-18v-10h-20v10h-22v-10H96v10H74v-10H54v10H42V82z" fill="url(#arcade-body)" />

            {bodyPixels.map(([x, y], index) => (
              <rect key={`${x}-${y}`} className="arcade-pixel-spark" x={x} y={y} width="8" height="8" fill="#fff" opacity={index < 4 ? 0.5 : 0.22} style={{ animationDelay: `${-index * 0.13}s` }} />
            ))}

            <g clipPath="url(#arcade-screen-clip)">
              <rect className="arcade-scan" x="42" y="35" width="136" height="10" fill="#fff" opacity="0.22" />
            </g>

            <g className="arcade-face-motion" data-gsap>
              <g className="arcade-face arcade-face-neutral">
                <path d="M72 82h16v-10h18v10h8v42h-10v12H90v-12H72zM122 82h16v-10h18v10h8v42h-10v12h-14v-12h-18z" fill="#fff" />
                <g className="arcade-eye">
                  <rect x="94" y="88" width="12" height="38" fill="#050b12" />
                  <rect x="142" y="88" width="12" height="38" fill="#050b12" />
                </g>
              </g>

              <g className="arcade-face arcade-face-happy">
                <path d="M74 104h12V94h18v10h10v12H102v10H86v-10H74zM124 104h12V94h18v10h10v12h-12v10h-16v-10h-12z" fill="#fff" />
                <path d="M88 140h44v10h-10v8H98v-8H88z" fill="#061041" />
              </g>

              <g className="arcade-face arcade-face-worried">
                <path d="M72 88h34v12H82v10H72zM124 88h34v22h-10v-10h-24z" fill="#fff" />
                <path d="M92 150h36v-10H92z" fill="#061041" />
              </g>

              <g className="arcade-face arcade-face-sleepy">
                <rect x="72" y="106" width="40" height="8" fill="#fff" />
                <rect x="122" y="106" width="40" height="8" fill="#fff" />
                <rect x="96" y="146" width="28" height="8" fill="#061041" />
              </g>

              <g className="arcade-face arcade-face-celebrate">
                <path d="M72 104h12V92h12v12h12v12H96v12H84v-12H72zM126 104h12V92h12v12h12v12h-12v12h-12v-12h-12z" fill="#fff" />
                <path d="M86 138h48v12h-8v10H94v-10h-8z" fill="#061041" />
              </g>
            </g>
          </g>
        </g>

        <g data-gsap>
          {burstPixels.map(([x, y, color], index) => (
            <rect
              className="arcade-burst-particle"
              key={`${x}-${y}`}
              x={Number(x) - 5}
              y={Number(y) - 5}
              width="10"
              height="10"
              fill={String(color)}
              transform={`rotate(${index % 2 ? 45 : 0} ${x} ${y})`}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}