import { MascotCreatureProps } from "../mascot.types";

export function MemphisMascot({ mood, reaction }: MascotCreatureProps) {
  return (
    <svg className="mascot-svg mascot-memphis" viewBox="0 0 100 100" aria-hidden="true" focusable="false" data-creature="living geometry" data-mood={mood} data-reaction={reaction ?? "none"}>
      <g className="mascot-creature">
        <circle className="mascot-body mascot-fill" cx="43" cy="56" r="20"/><rect className="mascot-shape" x="56" y="42" width="22" height="22" rx="3"/><path className="mascot-shape accent" d="M31 35l16-22 14 24z"/><path className="mascot-mouth" d="M39 65q8 5 16 0"/><path className="mascot-pattern" d="M19 72h12m41-47h10M22 27l7 7m46 36l7 7"/>
        <g className="mascot-eyes">
          <ellipse className="mascot-eye" cx="42" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
          <ellipse className="mascot-eye" cx="58" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
        </g>
      </g>
    </svg>
  );
}
