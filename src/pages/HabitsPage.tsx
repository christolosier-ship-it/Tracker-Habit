import { useState } from "react";
import { Edit3, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { PeriodControls } from "../features/period/PeriodControls";
import { categories } from "../data/demoData";
import { formatLocalIso } from "../lib/date-utils";
import { Habit } from "../types";
import { HabitsPageProps } from "./page-types";

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

  const deleteHabit = (habit: Habit) => {
    const confirmed = window.confirm(
      `Supprimer définitivement l’habitude « ${habit.nom} » et tout son historique ?`,
    );
    if (!confirmed) return;

    onDeleteHabit(habit.id);
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
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
      </Card>
      <section className="editor-grid">
        {filteredHabits.map((habit) => (
          <Card
            className={`habit-editor ${habit.active ? "" : "disabled"}`}
            key={habit.id}
          >
            <div className="editor-title">
              <Edit3 />
              <input
                value={habit.nom}
                onChange={(event) =>
                  updateHabit(habit.id, { nom: event.target.value })
                }
                aria-label="Nom de l’habitude"
              />
            </div>
            <div className="editor-fields">
              <label>
                Catégorie
                <select
                  value={habit.categorie}
                  onChange={(event) =>
                    updateHabit(habit.id, {
                      categorie: event.target.value as Habit["categorie"],
                    })
                  }
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label>
                Fréquence
                <select
                  value={habit.frequence}
                  onChange={(event) =>
                    updateHabit(habit.id, {
                      frequence: event.target.value as Habit["frequence"],
                    })
                  }
                >
                  <option value="quotidienne">Quotidienne</option>
                  <option value="hebdomadaire">Hebdomadaire</option>
                </select>
              </label>
              <label>
                Objectif
                <input
                  value={habit.objectif}
                  onChange={(event) =>
                    updateHabit(habit.id, { objectif: event.target.value })
                  }
                />
              </label>
              <label>
                Priorité
                <select
                  value={habit.priorite}
                  onChange={(event) =>
                    updateHabit(habit.id, {
                      priorite: event.target.value as Habit["priorite"],
                    })
                  }
                >
                  <option value="faible">Faible</option>
                  <option value="normale">Normale</option>
                  <option value="haute">Haute</option>
                </select>
              </label>
            </div>
            <div className="settings-actions habit-editor-actions">
              <Button
                variant="secondary"
                onClick={() => updateHabit(habit.id, { active: !habit.active })}
                type="button"
              >
                {habit.active ? <EyeOff /> : <Eye />}
                {habit.active ? "Désactiver" : "Réactiver"}
              </Button>
              <Button
                className="habit-delete-button"
                variant="danger"
                onClick={() => deleteHabit(habit)}
                type="button"
                aria-label={`Supprimer l’habitude ${habit.nom}`}
                title="Supprimer l’habitude et son historique"
              >
                <Trash2 />
              </Button>
            </div>
          </Card>
        ))}
      </section>
    </>
  );
}
