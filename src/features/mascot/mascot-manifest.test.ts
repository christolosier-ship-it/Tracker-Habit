import { describe, expect, it } from "vitest";
import { mascotThemeIds } from "./mascot-manifest";
import { themes } from "../../themes/theme-registry";

describe("mascot manifest", () => {
  it("couvre exactement les douze thèmes", () => {
    expect(mascotThemeIds).toEqual(themes.map((theme) => theme.id));
    expect(mascotThemeIds).toHaveLength(12);
  });
});
