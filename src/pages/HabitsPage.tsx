import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { PeriodControls } from "../features/period/PeriodControls";
import { HABIT_CATEGORIES } from "../domain/definitions";
import { formatLocalIso } from "../lib/date-utils";
import { Habit } from "../types";
import { HabitsPageProps } from "./page-types";
import { HabitEditor } from "../features/tracking/HabitEditor";

export function HabitsPage({
  data,
  setSettings,
  addHabit: onAddHabit,
  updateHabit,
  deleteHabit: onDeleteHabit,
}: HabitsPageProps) {
  const [filter, setFilter] = useState("Toutes");
  const filteredHabits = data.habits.filter(
    (habit) => filter === "Toutes" || habit.categorie === filter,
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
      couleur: "#1F6B4E",
      dateCreation: formatLocalIso(new Date()),
    };

    onAddHabit(newHabit);
  };

  return (
    <>
      <PeriodControls
        year={data.settings.anneeActive}
        month={data.settings.moisActif}
        onYearChange={(year) => setSettings({ anneeActive: year })}
        onMonthChange={(month) => setSettings({ moisActif: month })}
      />
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
            key={habit.id}
          />
        ))}
      </section>
    </>
  );
}
