import { MascotCreatureProps } from "../mascot.types";

export function EditorialMascot({ mood, reaction }: MascotCreatureProps) {
  return (
    <svg className="mascot-svg mascot-editorial" viewBox="0 0 100 100" aria-hidden="true" focusable="false" data-creature="stylized black cat" data-mood={mood} data-reaction={reaction ?? "none"}>
      <g className="mascot-creature">
        <path className="mascot-tail" d="M67 65c23-10 7-38-6-19"/><path className="mascot-body mascot-fill" d="M31 82c1-25 8-42 19-42s19 17 19 42z"/><path className="mascot-ear" d="M35 43l5-18 9 15M65 43l-5-18-9 15"/><path className="mascot-mouth" d="M45 65q5 3 10 0"/><circle className="mascot-jewel" cx="50" cy="76" r="3"/>
        <g className="mascot-eyes">
          <ellipse className="mascot-eye" cx="42" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
          <ellipse className="mascot-eye" cx="58" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
        </g>
      </g>
    </svg>
  );
}
