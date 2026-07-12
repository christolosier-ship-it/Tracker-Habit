import { Check, Clock, Pause, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { HabitStatus } from "../../types";
import * as S from "../../lib/stats";

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
      {S.statusLabels[status]}
    </Button>
  );
}
