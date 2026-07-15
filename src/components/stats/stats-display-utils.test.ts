import { describe, expect, it } from "vitest";
import { resolveTheme } from "../../themes/theme-registry";
import {
  fragileMonth,
  scoreBadge,
  strongestMonth,
} from "./stats-display-utils";

describe("présentation des scores", () => {
  it("ignore seulement les mois sans données et conserve un vrai 0 %", () => {
    const monthly = [
      { mois: "Jan", score: null },
      { mois: "Fév", score: 0 },
      { mois: "Mar", score: 65 },
    ];
    expect(strongestMonth(monthly)?.mois).toBe("Mar");
    expect(fragileMonth(monthly)?.mois).toBe("Fév");
  });

  it("présente 0 % comme une mesure fragile, pas comme une absence", () => {
    const badge = scoreBadge(resolveTheme("dopamine-pop"), 0);
    expect(badge.label).toBe("Fragile");
  });
});
