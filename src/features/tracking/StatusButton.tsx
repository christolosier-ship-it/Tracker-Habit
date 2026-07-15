import { Check, Clock, Pause, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { HabitStatus } from "../../types";
import { HABIT_STATUS_DEFINITIONS } from "../../domain/definitions";

type StatusButtonProps = {
  status: HabitStatus;
  onClick: () => void;
};

export function StatusButton({ status, onClick }: StatusButtonProps) {
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
      type="button"
      variant="status"
    >
      <Icon />
      {HABIT_STATUS_DEFINITIONS[status].label}
    </Button>
  );
}
