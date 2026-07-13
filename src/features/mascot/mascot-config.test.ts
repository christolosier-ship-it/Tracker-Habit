import { describe, expect, it } from "vitest";
import { mascotByTheme } from "./mascot-config";
import { themes } from "../../themes/theme-registry";

describe("mascotByTheme", () => {
  it("couvre exactement les douze thèmes", () => {
    expect(Object.keys(mascotByTheme)).toEqual(themes.map((theme) => theme.id));
    expect(Object.keys(mascotByTheme)).toHaveLength(12);
    expect(Object.values(mascotByTheme).every(Boolean)).toBe(true);
  });
});
