import { MascotCreatureProps } from "../mascot.types";

export function BrutalistMascot({ mood, reaction }: MascotCreatureProps) {
  return (
    <svg className="mascot-svg mascot-brutalist" viewBox="0 0 100 100" aria-hidden="true" focusable="false" data-creature="concrete cube" data-mood={mood} data-reaction={reaction ?? "none"}>
      <g className="mascot-creature">
        <rect className="mascot-body mascot-fill brutal" x="27" y="34" width="48" height="48"/><path className="mascot-crack" d="M49 34l-7 14 9 9-8 25M27 51h48M39 82V34"/><path className="mascot-mouth" d="M42 66h16"/><rect className="mascot-sparkle" x="18" y="74" width="10" height="10"/>
        <g className="mascot-eyes">
          <ellipse className="mascot-eye" cx="42" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
          <ellipse className="mascot-eye" cx="58" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
        </g>
      </g>
    </svg>
  );
}
