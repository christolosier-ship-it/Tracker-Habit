import { MascotCreatureProps } from "../mascot.types";

export function AuroraMascot({ mood, reaction }: MascotCreatureProps) {
  return (
    <svg className="mascot-svg mascot-aurora" viewBox="0 0 100 100" aria-hidden="true" focusable="false" data-creature="spectral firefly" data-mood={mood} data-reaction={reaction ?? "none"}>
      <g className="mascot-creature">
        <ellipse className="mascot-wing" cx="34" cy="46" rx="17" ry="11"/><ellipse className="mascot-wing" cx="66" cy="46" rx="17" ry="11"/><ellipse className="mascot-body mascot-fill" cx="50" cy="58" rx="15" ry="24"/><circle className="mascot-halo" cx="50" cy="58" r="31"/><path className="mascot-mouth" d="M43 68q7 5 14 0"/><path className="mascot-sparkle" d="M50 20l3 6 6 3-6 3-3 6-3-6-6-3 6-3z"/>
        <g className="mascot-eyes">
          <ellipse className="mascot-eye" cx="42" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
          <ellipse className="mascot-eye" cx="58" cy="55" rx="3.2" ry={mood === "sleepy" ? 1 : 4} />
        </g>
      </g>
    </svg>
  );
}
