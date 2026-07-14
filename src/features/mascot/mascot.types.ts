import { ThemeId } from "../../themes/theme-types";

export type MascotMood =
  | "idle"
  | "happy"
  | "celebrate"
  | "sleepy"
  | "worried"
  | "hidden";

export type MascotReaction = "habit-done" | "perfect-day" | "streak-record";

export type MascotReactionEvent = {
  id: number;
  type: MascotReaction;
};

export type DashboardMascotProps = {
  themeId: ThemeId;
  mood: MascotMood;
  reaction?: MascotReactionEvent | null;
  onReactionComplete?: (reactionId: number) => void;
};

export type MascotCreatureProps = {
  mood: Exclude<MascotMood, "hidden">;
  reaction: MascotReaction | null;
  onReactionComplete?: () => void;
};
