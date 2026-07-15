import type {
  TrackerReaction,
  TrackerReactionEvent,
} from "../../app/tracker-events";
import { ThemeId } from "../../themes/theme-types";

export type MascotMood =
  | "idle"
  | "happy"
  | "celebrate"
  | "sleepy"
  | "worried"
  | "hidden";

export type MascotReaction = TrackerReaction;
export type MascotReactionEvent = TrackerReactionEvent;

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
