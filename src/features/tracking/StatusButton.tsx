import { Check, Clock, Pause, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { HabitStatus } from "../../types";
import { HABIT_STATUS_DEFINITIONS } from "../../domain/definitions";

type StatusButtonProps = {
  status: HabitStatus;
  onClick: () => void;
  disabled?: boolean;
};

export function StatusButton({ status, onClick, disabled = false }: StatusButtonProps) {
  const Icon =
    status === "done"
      ? Check
      : status === "partial"
        ? Clock
        : status === "missed"
          ? X
          : status === "rest"
            ? Pause
            : Clock;
  const label = HABIT_STATUS_DEFINITIONS[status].label;

  return (
    <Button
      className={`status-button ${status}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
      variant="status"
      aria-label={`Statut : ${label}. Cliquer pour changer.`}
      title={`Statut : ${label}`}
    >
      <span className="status-button-icon" aria-hidden="true">
        <Icon />
      </span>
      <span className="status-button-label">{label}</span>
    </Button>
  );
}
