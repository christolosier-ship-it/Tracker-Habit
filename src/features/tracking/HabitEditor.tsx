import { memo, useEffect, useState } from "react";
import { Edit3, Eye, EyeOff, Trash2 } from "lucide-react";
import type { DeleteHabit, UpdateHabit } from "../../app/tracker-actions";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { HABIT_CATEGORIES } from "../../domain/definitions";
import type { Habit } from "../../types";

type HabitEditorProps = {
  habit: Habit;
  updateHabit: UpdateHabit;
  deleteHabit: DeleteHabit;
};

export const HabitEditor = memo(function HabitEditor({
  habit,
  updateHabit,
  deleteHabit,
}: HabitEditorProps) {
  const [name, setName] = useState(habit.nom);
  const [objective, setObjective] = useState(habit.objectif);

  useEffect(() => setName(habit.nom), [habit.nom]);
  useEffect(() => setObjective(habit.objectif), [habit.objectif]);

  const commitText = (
    field: "nom" | "objectif",
    value: string,
    original: string,
  ) => {
    if (value !== original) updateHabit(habit.id, { [field]: value });
  };

  const confirmDelete = () => {
    if (
      window.confirm(
        `Supprimer définitivement l’habitude « ${habit.nom} » et tout son historique ?`,
      )
    ) {
      deleteHabit(habit.id);
    }
  };

  return (
    <Card className={`habit-editor ${habit.active ? "" : "disabled"}`}>
      <div className="editor-title">
        <Edit3 />
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          onBlur={() => commitText("nom", name, habit.nom)}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
          }}
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
            {HABIT_CATEGORIES.map((category) => (
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
            value={objective}
            onChange={(event) => setObjective(event.target.value)}
            onBlur={() => commitText("objectif", objective, habit.objectif)}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
            }}
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
          onClick={confirmDelete}
          type="button"
          aria-label={`Supprimer l’habitude ${habit.nom}`}
          title="Supprimer l’habitude et son historique"
        >
          <Trash2 />
        </Button>
      </div>
    </Card>
  );
});
