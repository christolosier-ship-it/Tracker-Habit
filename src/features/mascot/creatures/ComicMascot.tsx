import { MascotCreatureProps } from "../mascot.types";

export function ComicMascot({ mood, reaction }: MascotCreatureProps) {
  return (
    <svg className="mascot-svg mascot-comic" viewBox="0 0 100 100" aria-hidden="true" focusable="false" data-creature="mini masked hero" data-mood={mood} data-reaction={reaction ?? "none"}>
      <g className="mascot-creature">
        <path className="mascot-cape" d="M35 45L17 75l27-8z"/><ellipse className="mascot-body mascot-fill" cx="52" cy="57" rx="21" ry="27"/><path className="mascot-mask" d="M34 50q18-10 36 0v9q-18 8-36 0z"/><path className="mascot-mouth" d="M43 69q9 7 18 0"/><text className="mascot-pow" x="14" y="31">POW</text>
        <g className="mascot-eyes">
          <ellipse className="mascot-eye" cx="42" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
          <ellipse className="mascot-eye" cx="58" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
        </g>
      </g>
    </svg>
  );
}
