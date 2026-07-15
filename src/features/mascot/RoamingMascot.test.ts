import { describe, expect, it } from "vitest";
import { parseCssTranslate } from "./mascot-position";

describe("position rendue de la mascotte", () => {
  it("lit une matrice CSS 2D", () => {
    expect(parseCssTranslate("matrix(1, 0, 0, 1, 42.5, 19)")).toEqual({
      x: 42.5,
      y: 19,
    });
  });

  it("lit une matrice CSS 3D et ignore none", () => {
    expect(
      parseCssTranslate(
        "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 81, 37, 0, 1)",
      ),
    ).toEqual({ x: 81, y: 37 });
    expect(parseCssTranslate("none")).toBeNull();
  });
});
