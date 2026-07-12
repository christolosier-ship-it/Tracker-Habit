import {
  BarChart3,
  CalendarDays,
  Check,
  LayoutDashboard,
  Plus,
  Settings,
} from "lucide-react";
import type React from "react";
import type { HabitStatus } from "../types";

export type Page =
  | "Dashboard"
  | "Aujourd’hui"
  | "Mois"
  | "Habitudes"
  | "Statistiques"
  | "Paramètres";

export type FilterToday = "Quotidiennes" | "Hebdomadaires" | "Toutes";

export const monthShortLabels = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
] as const;

export const monthLongLabels = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
] as const;

export const pageSpecs: Array<{ name: Page; icon: React.ElementType }> = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Aujourd’hui", icon: Check },
  { name: "Mois", icon: CalendarDays },
  { name: "Habitudes", icon: Plus },
  { name: "Statistiques", icon: BarChart3 },
  { name: "Paramètres", icon: Settings },
];

export const formatPercent = (value: number) => `${Math.round(value)}%`;

export function statusSymbol(status: HabitStatus) {
  if (status === "done") return "✓";
  if (status === "partial") return "◐";
  if (status === "missed") return "×";
  if (status === "rest") return "Ⅱ";
  return "·";
}
