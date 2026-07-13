import { MascotCreatureProps } from "../mascot.types";

export function DopamineMascot({ mood, reaction }: MascotCreatureProps) {
  return (
    <svg className="mascot-svg mascot-dopamine" viewBox="0 0 100 100" aria-hidden="true" focusable="false" data-creature="blob candy" data-mood={mood} data-reaction={reaction ?? "none"}>
      <g className="mascot-creature">
        <ellipse className="mascot-body mascot-fill" cx="50" cy="58" rx="26" ry="24"/><circle className="mascot-cheek" cx="36" cy="61" r="4"/><circle className="mascot-cheek" cx="64" cy="61" r="4"/><path className="mascot-limb" d="M27 59q-12 2-14 12M73 59q12 2 14 12"/><path className="mascot-mouth" d="M42 68q8 7 16 0"/><path className="mascot-sparkle" d="M20 24l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/><path className="mascot-sparkle" d="M78 24l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>
        <g className="mascot-eyes">
          <ellipse className="mascot-eye" cx="42" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
          <ellipse className="mascot-eye" cx="58" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
        </g>
      </g>
    </svg>
  );
}
