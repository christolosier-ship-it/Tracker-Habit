import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MascotRenderer } from "./MascotRenderer";

describe("MascotRenderer", () => {
  it("ne rend rien quand l’humeur est hidden", () => {
    expect(renderToStaticMarkup(<MascotRenderer themeId="dopamine-pop" mood="hidden" />)).toBe("");
  });

  it("rend un conteneur lazy identifié par thème", () => {
    const html = renderToStaticMarkup(
      <MascotRenderer
        themeId="dopamine-pop"
        mood="happy"
        reaction={{ id: 1, type: "habit-done" }}
      />,
    );
    expect(html).toContain('class="app-mascot"');
    expect(html).toContain('data-theme="dopamine-pop"');
    expect(html).toContain('data-mood="happy"');
  });
});
