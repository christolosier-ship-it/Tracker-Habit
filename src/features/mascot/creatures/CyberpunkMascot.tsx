import { MascotCreatureProps } from "../mascot.types";

export function CyberpunkMascot({ mood, reaction }: MascotCreatureProps) {
  return (
    <svg className="mascot-svg mascot-cyberpunk" viewBox="0 0 100 100" aria-hidden="true" focusable="false" data-creature="neon drone" data-mood={mood} data-reaction={reaction ?? "none"}>
      <g className="mascot-creature">
        <rect className="mascot-body mascot-fill" x="28" y="38" width="44" height="28" rx="8"/><circle className="mascot-eye-core" cx="50" cy="52" r="9"/><path className="mascot-limb" d="M28 47H14v-8M72 47h14v-8M42 38l-5-13M58 38l5-13"/><path className="mascot-scan" d="M24 52h52"/><path className="mascot-sparkle" d="M17 73h18M65 73h18"/>
        <g className="mascot-eyes">
          <ellipse className="mascot-eye" cx="42" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
          <ellipse className="mascot-eye" cx="58" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
        </g>
      </g>
    </svg>
  );
}
