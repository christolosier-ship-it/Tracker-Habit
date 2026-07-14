import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DashboardMascot } from "./DashboardMascot";
import { themes } from "../../themes/theme-registry";

describe("MascotRenderer", () => {
  it("ne rend rien quand l’humeur est hidden", () => {
    expect(renderToStaticMarkup(<DashboardMascot themeId="dopamine-pop" mood="hidden" />)).toBe("");
  });

  it("rend un conteneur lazy correctement identifié pour chaque thème", () => {
    for (const theme of themes) {
      const html = renderToStaticMarkup(
        <DashboardMascot
          themeId={theme.id}
          mood="happy"
          reaction={{ id: 1, type: "habit-done" }}
        />,
      );
      expect(html).toContain('class="app-mascot"');
      expect(html).toContain('data-theme="' + theme.id + '"');
      expect(html).toContain('data-mood="happy"');
    }
  });
});
