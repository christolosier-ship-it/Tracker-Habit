import { monthLongLabels } from "../../app/constants";

export type PeriodControlsProps = {
  year: number;
  month: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
};

export function PeriodControls({
  year,
  month,
  onYearChange,
  onMonthChange,
}: PeriodControlsProps) {
  return (
    <section className="hero-card period-controls" aria-label="Période active">
      <div className="hero-controls">
        <label>
          Année
          <input
            type="number"
            value={year}
            onChange={(event) => onYearChange(Number(event.target.value))}
          />
        </label>
        <label>
          Mois actif
          <select
            value={month}
            onChange={(event) => onMonthChange(Number(event.target.value))}
          >
            {monthLongLabels.map((label, index) => (
              <option value={index} key={label}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
