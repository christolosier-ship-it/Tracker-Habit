import { CycleStatus } from "../../app/tracker-actions";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import type { Habit, HabitStatus } from "../../types";
import { StatusButton } from "./StatusButton";

type HabitStatusCardProps = {
  habit: Habit;
  date: string;
  status: HabitStatus;
  cycle: CycleStatus;
  canEdit?: boolean;
};

export function HabitStatusCard({
  habit,
  date,
  status,
  cycle,
  canEdit = true,
}: HabitStatusCardProps) {
  return (
    <Card className="habit-card">
      <div>
        <Badge
          variant={
            status === "done"
              ? "success"
              : status === "missed"
                ? "danger"
                : "default"
          }
        >
          {habit.categorie}
        </Badge>
        <h3>{habit.nom}</h3>
        <p>
          {habit.objectif} · {habit.frequence} · priorité {habit.priorite}
        </p>
      </div>
      <StatusButton
        status={status}
        onClick={() => cycle(habit.id, date)}
        disabled={!canEdit}
      />
    </Card>
  );
}
