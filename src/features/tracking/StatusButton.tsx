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

  return (
    <Button
      className={`status-button ${status}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
      variant="status"
    >
      <Icon />
      {HABIT_STATUS_DEFINITIONS[status].label}
    </Button>
  );
}
