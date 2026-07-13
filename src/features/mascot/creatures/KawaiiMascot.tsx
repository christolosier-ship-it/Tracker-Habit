import { MascotCreatureProps } from "../mascot.types";

export function KawaiiMascot({ mood, reaction }: MascotCreatureProps) {
  return (
    <svg className="mascot-svg mascot-kawaii" viewBox="0 0 100 100" aria-hidden="true" focusable="false" data-creature="cloud bunny" data-mood={mood} data-reaction={reaction ?? "none"}>
      <g className="mascot-creature">
        <path className="mascot-ear" d="M35 43C24 13 35 8 43 39z"/><path className="mascot-ear" d="M61 39c8-31 20-25 8 4z"/><path className="mascot-body mascot-fill" d="M26 61c0-13 12-19 22-14 12-8 28 0 28 15 10 4 6 22-8 22H33c-17 0-20-19-7-23z"/><path className="mascot-mouth" d="M43 68q7 7 14 0"/><path className="mascot-sparkle" d="M78 26l3 5 5 3-5 3-3 5-3-5-5-3 5-3z"/>
        <g className="mascot-eyes">
          <ellipse className="mascot-eye" cx="42" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
          <ellipse className="mascot-eye" cx="58" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
        </g>
      </g>
    </svg>
  );
}
