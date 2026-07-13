import { MascotMood } from "./mascot.types";

export type MascotMoodInput = {
  enabled: boolean;
  todayScore: number;
  monthScore: number;
  fragileHabitCount: number;
  currentHour: number;
};

export function selectMascotMood(input: MascotMoodInput): MascotMood {
  if (!input.enabled) return "hidden";
  if (input.todayScore >= 100 || input.monthScore >= 90) return "celebrate";
  if (input.todayScore >= 70) return "happy";
  if (input.fragileHabitCount >= 4) return "worried";
  if (input.currentHour >= 22 || input.currentHour < 6) return "sleepy";
  return "idle";
}
