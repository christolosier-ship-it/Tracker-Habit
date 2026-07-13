import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DashboardMascot } from "./DashboardMascot";
import { themes } from "../../themes/theme-registry";

describe("DashboardMascot", () => {
  it("ne rend rien quand l’humeur est hidden", () => {
    expect(renderToStaticMarkup(<DashboardMascot themeId="dopamine-pop" mood="hidden" />)).toBe("");
  });

  it("rend un SVG accessible pour chaque thème", () => {
    for (const theme of themes) {
      const html = renderToStaticMarkup(
        <DashboardMascot
          themeId={theme.id}
          mood="happy"
          reaction={{ id: 1, type: "habit-done" }}
        />,
      );
      expect(html).toContain("Compagnon animé du Dashboard");
      expect(html).toContain('data-mood="happy"');
      expect(html).toContain("<svg");
    }
  });
});
