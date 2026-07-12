import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { AppData } from "../../lib/storage";
import { Habit } from "../../types";
import * as S from "../../lib/stats";
import { StatusButton } from "./StatusButton";

export type CycleStatus = (habitId: string, date: string) => void;

type HabitStatusCardProps = {
  habit: Habit;
  date: string;
  data: AppData;
  cycle: CycleStatus;
};

export function HabitStatusCard({
  habit,
  date,
  data,
  cycle,
}: HabitStatusCardProps) {
  const status = S.logFor(data.logs, habit.id, date);

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
      <StatusButton status={status} onClick={() => cycle(habit.id, date)} />
    </Card>
  );
}
