import { MascotCreatureProps } from "../mascot.types";

export function TropicalMascot({ mood, reaction }: MascotCreatureProps) {
  return (
    <svg className="mascot-svg mascot-tropical" viewBox="0 0 100 100" aria-hidden="true" focusable="false" data-creature="mini toucan" data-mood={mood} data-reaction={reaction ?? "none"}>
      <g className="mascot-creature">
        <ellipse className="mascot-body mascot-fill" cx="48" cy="60" rx="20" ry="24"/><path className="mascot-beak" d="M54 46c25-7 36 3 9 15H52z"/><path className="mascot-wing" d="M36 58q-17 8-9 25 15-5 19-19z"/><path className="mascot-branch" d="M25 84h53M32 82q8-15 19-4"/><path className="mascot-mouth" d="M45 70q5 4 10 0"/>
        <g className="mascot-eyes">
          <ellipse className="mascot-eye" cx="42" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
          <ellipse className="mascot-eye" cx="58" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
        </g>
      </g>
    </svg>
  );
}
