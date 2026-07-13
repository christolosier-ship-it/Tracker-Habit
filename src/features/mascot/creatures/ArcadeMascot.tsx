import { MascotCreatureProps } from "../mascot.types";

export function ArcadeMascot({ mood, reaction }: MascotCreatureProps) {
  return (
    <svg className="mascot-svg mascot-arcade" viewBox="0 0 100 100" aria-hidden="true" focusable="false" data-creature="pixel ghost" data-mood={mood} data-reaction={reaction ?? "none"}>
      <g className="mascot-creature">
        <path className="mascot-body mascot-fill pixel" d="M26 30h48v8h8v40h-8v8H62v-8H50v8H38v-8H26z"/><rect className="mascot-pixel" x="18" y="24" width="8" height="8"/><rect className="mascot-pixel" x="78" y="70" width="8" height="8"/><path className="mascot-mouth" d="M42 66h16"/>
        <g className="mascot-eyes">
          <ellipse className="mascot-eye" cx="42" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
          <ellipse className="mascot-eye" cx="58" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
        </g>
      </g>
    </svg>
  );
}
