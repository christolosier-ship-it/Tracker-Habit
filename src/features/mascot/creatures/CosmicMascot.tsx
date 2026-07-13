import { MascotCreatureProps } from "../mascot.types";

export function CosmicMascot({ mood, reaction }: MascotCreatureProps) {
  return (
    <svg className="mascot-svg mascot-cosmic" viewBox="0 0 100 100" aria-hidden="true" focusable="false" data-creature="living planet" data-mood={mood} data-reaction={reaction ?? "none"}>
      <g className="mascot-creature">
        <ellipse className="mascot-ring" cx="50" cy="56" rx="42" ry="12"/><circle className="mascot-body mascot-fill" cx="50" cy="56" r="24"/><circle className="mascot-moon" cx="78" cy="26" r="6"/><path className="mascot-mouth" d="M42 65q8 5 16 0"/><path className="mascot-sparkle" d="M22 26l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>
        <g className="mascot-eyes">
          <ellipse className="mascot-eye" cx="42" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
          <ellipse className="mascot-eye" cx="58" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
        </g>
      </g>
    </svg>
  );
}
