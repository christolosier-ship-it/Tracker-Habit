import { MascotCreatureProps } from "../mascot.types";

export function LiquidMascot({ mood, reaction }: MascotCreatureProps) {
  return (
    <svg className="mascot-svg mascot-liquid" viewBox="0 0 100 100" aria-hidden="true" focusable="false" data-creature="polymorph drop" data-mood={mood} data-reaction={reaction ?? "none"}>
      <g className="mascot-creature">
        <path className="mascot-body mascot-fill" d="M50 16c19 21 30 34 22 52-7 17-36 22-50 5C8 55 26 34 50 16z"/><ellipse className="mascot-glint" cx="39" cy="43" rx="8" ry="13"/><path className="mascot-blob" d="M68 30c10 8 10 19 1 26"/><path className="mascot-mouth" d="M42 65q8 5 16 0"/>
        <g className="mascot-eyes">
          <ellipse className="mascot-eye" cx="42" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
          <ellipse className="mascot-eye" cx="58" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
        </g>
      </g>
    </svg>
  );
}
