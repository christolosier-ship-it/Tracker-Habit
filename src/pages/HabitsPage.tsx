import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { HABIT_CATEGORIES } from "../domain/definitions";
import { formatLocalIso } from "../lib/date-utils";
import { Habit } from "../types";
import { HabitsPageProps } from "./page-types";
import { HabitEditor } from "../features/tracking/HabitEditor";

export function HabitsPage({
  data,
  addHabit: onAddHabit,
  updateHabit,
  deleteHabit: onDeleteHabit,
}: HabitsPageProps) {
  const [filter, setFilter] = useState("Toutes");
  const filteredHabits = useMemo(
    () => data.habits.filter(
      (habit) => filter === "Toutes" || habit.categorie === filter,
    ),
    [data.habits, filter],
  );
  const habitsWithHistory = useMemo(
    () => new Set(data.logs.map((log) => log.habitId)),
    [data.logs],
  );

  const addHabit = () => {
    const newHabit: Habit = {
      id: `custom-${Date.now()}`,
      nom: "Nouvelle habitude",
      categorie: "Autre",
      frequence: "quotidienne",
      objectif: "1 fois",
      priorite: "normale",
      active: true,
      dateCreation: formatLocalIso(new Date()),
    };

    onAddHabit(newHabit);
  };

  return (
    <>
      <Card className="habit-toolbar">
        <Button onClick={addHabit} type="button">
          <Plus /> Ajouter une habitude
        </Button>
        <label>
          Filtrer
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option>Toutes</option>
            {HABIT_CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
      </Card>
      <section className="editor-grid">
        {filteredHabits.map((habit) => (
          <HabitEditor
            habit={habit}
            updateHabit={updateHabit}
            deleteHabit={onDeleteHabit}
            hasHistory={habitsWithHistory.has(habit.id)}
            key={habit.id}
          />
        ))}
      </section>
    </>
  );
}
