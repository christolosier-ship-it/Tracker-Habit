import { useRef } from "react";
import type { MascotCreatureProps } from "../mascot.types";
import { cyberpunkReactions } from "./cyberpunk-reactions";
import { useGsapReactionRuntime } from "../gsap-runtime";
import "./cyberpunk-mascot.css";

const eyePixels = [
  [84, 94], [90, 94], [96, 94],
  [84, 101], [90, 101], [96, 101],
  [84, 108], [90, 108], [96, 108],
  [119, 94], [125, 94], [131, 94],
  [119, 101], [125, 101], [131, 101],
  [119, 108], [125, 108], [131, 108],
] as const;

export function CyberpunkMascot({ mood, reaction, onReactionComplete }: MascotCreatureProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  useGsapReactionRuntime(
    svgRef, reaction ?? null, cyberpunkReactions.play, cyberpunkReactions.reset, onReactionComplete,
  );

  return (
    <svg
      ref={svgRef}
      className="mascot-svg mascot-cyberpunk-pro"
      viewBox="0 0 220 220"
      aria-hidden="true"
      focusable="false"
      data-creature="neon drone pro"
      data-mood={mood}
      data-reaction={reaction ?? "none"}
    >
      <defs>
        <linearGradient id="cyber-shell" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#243253" />
          <stop offset="0.45" stopColor="#071225" />
          <stop offset="1" stopColor="#020611" />
        </linearGradient>
        <linearGradient id="cyber-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#26375a" />
          <stop offset="0.55" stopColor="#071226" />
          <stop offset="1" stopColor="#02040c" />
        </linearGradient>
        <linearGradient id="cyber-neon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ff00df" />
          <stop offset="0.52" stopColor="#9b20ff" />
          <stop offset="1" stopColor="#00eaff" />
        </linearGradient>
        <linearGradient id="cyber-flame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.18" stopColor="#00f7ff" />
          <stop offset="0.62" stopColor="#20b9ff" stopOpacity="0.92" />
          <stop offset="1" stopColor="#00d9ff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="cyber-visor" cx="42%" cy="30%" r="85%">
          <stop offset="0" stopColor="#13224b" />
          <stop offset="0.55" stopColor="#04091b" />
          <stop offset="1" stopColor="#01030a" />
        </radialGradient>
        <filter id="cyber-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="cyber-strong-glow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="cyber-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <g className="cyber-rig">
        <ellipse
          cx="110"
          cy="199"
          rx="45"
          ry="8"
          fill="#071328"
          opacity="0.28"
          filter="url(#cyber-shadow)"
        />
        <circle
          className="cyber-status-ring"
          data-gsap
          cx="110"
          cy="111"
          r="73"
          fill="none"
          stroke="#00eaff"
          strokeWidth="1.5"
          strokeDasharray="5 9"
          filter="url(#cyber-glow)"
        />

        <g className="cyber-rotor-motion-left" data-gsap>
          <g className="cyber-rotor cyber-rotor-left">
            <path d="M72 68C59 55 57 38 61 23" fill="none" stroke="#070d20" strokeWidth="13" strokeLinecap="round" />
            <path d="M72 68C59 55 57 38 61 23" fill="none" stroke="url(#cyber-neon)" strokeWidth="2.4" strokeLinecap="round" />
            <ellipse cx="59" cy="19" rx="34" ry="8" fill="#040713" stroke="#ff00df" strokeWidth="3" filter="url(#cyber-glow)" />
            <g className="cyber-propeller" data-gsap>
              <path d="M30 19C39 12 51 12 59 19C50 24 39 24 30 19Z" fill="#331044" />
              <path d="M88 19C79 12 67 12 59 19C68 24 79 24 88 19Z" fill="#102944" />
            </g>
            <ellipse cx="59" cy="19" rx="6" ry="5" fill="#121a36" stroke="#00eaff" strokeWidth="1.5" />
          </g>
        </g>

        <g className="cyber-rotor-motion-right" data-gsap>
          <g className="cyber-rotor cyber-rotor-right">
            <path d="M148 68C161 55 163 38 159 23" fill="none" stroke="#070d20" strokeWidth="13" strokeLinecap="round" />
            <path d="M148 68C161 55 163 38 159 23" fill="none" stroke="url(#cyber-neon)" strokeWidth="2.4" strokeLinecap="round" />
            <ellipse cx="161" cy="19" rx="34" ry="8" fill="#040713" stroke="#ff00df" strokeWidth="3" filter="url(#cyber-glow)" />
            <g className="cyber-propeller" data-gsap>
              <path d="M132 19C141 12 153 12 161 19C152 24 141 24 132 19Z" fill="#102944" />
              <path d="M190 19C181 12 169 12 161 19C170 24 181 24 190 19Z" fill="#331044" />
            </g>
            <ellipse cx="161" cy="19" rx="6" ry="5" fill="#121a36" stroke="#00eaff" strokeWidth="1.5" />
          </g>
        </g>

        <g className="cyber-reactor-motion" data-gsap>
          <g className="cyber-reactor">
            <path d="M88 164H132L127 178H93Z" fill="url(#cyber-metal)" stroke="#ff00df" strokeWidth="2" />
            <ellipse cx="110" cy="177" rx="17" ry="5" fill="#071327" stroke="#00eaff" strokeWidth="2" />
            <g className="cyber-reactor-flame">
              <path d="M96 179C99 195 103 209 110 219C117 207 122 194 124 179Z" fill="url(#cyber-flame)" filter="url(#cyber-glow)" />
              <path d="M103 179C105 194 107 203 110 210C114 201 116 192 117 179Z" fill="#ffffff" opacity="0.66" />
            </g>
          </g>
        </g>

        <g className="cyber-arm-motion-left" data-gsap>
          <g className="cyber-arm cyber-arm-left">
            <path d="M65 102C48 102 40 113 40 128" fill="none" stroke="#071328" strokeWidth="16" strokeLinecap="round" />
            <path d="M65 102C48 102 40 113 40 128" fill="none" stroke="url(#cyber-neon)" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="40" cy="132" r="12" fill="url(#cyber-metal)" stroke="#00eaff" strokeWidth="2" />
            <circle cx="40" cy="132" r="4" fill="#ff00df" filter="url(#cyber-glow)" />
            <g className="cyber-claw-left">
              <path d="M38 142C25 144 22 155 28 163C33 169 41 167 44 160" fill="none" stroke="#0a1329" strokeWidth="7" strokeLinecap="round" />
              <path d="M42 142C55 144 58 155 52 163C47 169 39 167 36 160" fill="none" stroke="#0a1329" strokeWidth="7" strokeLinecap="round" />
              <path d="M38 142C25 144 22 155 28 163" fill="none" stroke="#00eaff" strokeWidth="2" strokeLinecap="round" />
              <path d="M42 142C55 144 58 155 52 163" fill="none" stroke="#ff00df" strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>
        </g>

        <g className="cyber-arm-motion-right" data-gsap>
          <g className="cyber-arm cyber-arm-right">
            <path d="M155 102C172 102 180 113 180 128" fill="none" stroke="#071328" strokeWidth="16" strokeLinecap="round" />
            <path d="M155 102C172 102 180 113 180 128" fill="none" stroke="url(#cyber-neon)" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="180" cy="132" r="12" fill="url(#cyber-metal)" stroke="#ff00df" strokeWidth="2" />
            <circle cx="180" cy="132" r="4" fill="#00eaff" filter="url(#cyber-glow)" />
            <g className="cyber-claw-right">
              <path d="M178 142C165 144 162 155 168 163C173 169 181 167 184 160" fill="none" stroke="#0a1329" strokeWidth="7" strokeLinecap="round" />
              <path d="M182 142C195 144 198 155 192 163C187 169 179 167 176 160" fill="none" stroke="#0a1329" strokeWidth="7" strokeLinecap="round" />
              <path d="M178 142C165 144 162 155 168 163" fill="none" stroke="#00eaff" strokeWidth="2" strokeLinecap="round" />
              <path d="M182 142C195 144 198 155 192 163" fill="none" stroke="#ff00df" strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>
        </g>

        <g className="cyber-body-motion" data-gsap>
          <g className="cyber-body">
            <ellipse cx="110" cy="109" rx="61" ry="61" fill="url(#cyber-shell)" stroke="#02030a" strokeWidth="5" />
            <path d="M58 86C70 55 91 45 110 45C86 58 74 72 69 94Z" fill="#31456f" opacity="0.35" />
            <path d="M71 65C91 48 126 43 151 62" fill="none" stroke="#ff00df" strokeWidth="3" opacity="0.75" filter="url(#cyber-glow)" />
            <path d="M57 112C59 142 78 164 108 169" fill="none" stroke="#7c1cff" strokeWidth="3" opacity="0.76" />
            <path d="M163 106C162 139 144 161 116 169" fill="none" stroke="#00eaff" strokeWidth="3" opacity="0.88" />
            <ellipse className="cyber-core-glow" cx="110" cy="109" rx="48" ry="38" fill="none" stroke="url(#cyber-neon)" strokeWidth="5" filter="url(#cyber-glow)" />
            <rect x="64" y="73" width="92" height="72" rx="28" fill="url(#cyber-visor)" stroke="#09162f" strokeWidth="4" />
            <path className="cyber-screen-glow" d="M78 78H142" fill="none" stroke="#00eaff" strokeWidth="3" strokeLinecap="round" filter="url(#cyber-glow)" />
            <path d="M71 89C84 76 103 72 121 75" fill="none" stroke="#ffffff" strokeWidth="2.4" opacity="0.23" strokeLinecap="round" />
            <path className="cyber-scan-line" d="M76 104H144" fill="none" stroke="#00eaff" strokeWidth="1.5" opacity="0" filter="url(#cyber-glow)" />

            <g className="cyber-face" data-gsap>
              <g className="cyber-eye-pixels" fill="#00eaff" filter="url(#cyber-glow)">
                {eyePixels.map(([x, y]) => (
                  <rect key={`${x}-${y}`} x={x} y={y} width="5" height="6" rx="1" />
                ))}
              </g>
              <g className="cyber-sleep-eyes" fill="none" stroke="#00eaff" strokeWidth="4" strokeLinecap="round" filter="url(#cyber-glow)">
                <path d="M84 105H100" />
                <path d="M120 105H136" />
              </g>
              <g className="cyber-star-eyes" fill="#00eaff" filter="url(#cyber-glow)">
                <path d="M92 92L95 100L103 103L95 106L92 114L89 106L81 103L89 100Z" />
                <path d="M128 92L131 100L139 103L131 106L128 114L125 106L117 103L125 100Z" />
              </g>
              <g className="cyber-worry-brows cyber-brow" fill="none" stroke="#ff00df" strokeWidth="3" strokeLinecap="round" filter="url(#cyber-glow)">
                <path d="M83 91L100 96" />
                <path d="M137 91L120 96" />
              </g>
              <path className="cyber-mouth-neutral" d="M101 125H107V129H113V125H119" fill="none" stroke="#00eaff" strokeWidth="3" />
              <path className="cyber-mouth-happy" d="M99 123H104V128H110V131H116V128H121V123" fill="none" stroke="#00eaff" strokeWidth="3" />
              <path className="cyber-mouth-worried" d="M99 130H104V126H110V123H116V126H121V130" fill="none" stroke="#00eaff" strokeWidth="3" />
              <path className="cyber-mouth-sleepy" d="M105 127H115" fill="none" stroke="#00eaff" strokeWidth="3" strokeLinecap="round" />
              <g className="cyber-cheeks" fill="#ff00df" filter="url(#cyber-glow)">
                <rect x="77" y="121" width="9" height="3" rx="1.5" />
                <rect x="134" y="121" width="9" height="3" rx="1.5" />
              </g>
            </g>
          </g>
        </g>

        <g fill="#00eaff" filter="url(#cyber-glow)">
          <path className="cyber-particle" data-gsap d="M35 85L38 92L45 95L38 98L35 105L32 98L25 95L32 92Z" />
          <path className="cyber-particle" data-gsap d="M185 78L188 85L195 88L188 91L185 98L182 91L175 88L182 85Z" />
          <circle className="cyber-particle" data-gsap cx="52" cy="58" r="3" fill="#ff00df" />
          <circle className="cyber-particle" data-gsap cx="169" cy="57" r="3" fill="#00eaff" />
          <rect className="cyber-particle" data-gsap x="41" y="173" width="5" height="5" rx="1" fill="#7c1cff" />
          <rect className="cyber-particle" data-gsap x="174" y="169" width="5" height="5" rx="1" fill="#ff00df" />
        </g>
      </g>
    </svg>
  );
}
