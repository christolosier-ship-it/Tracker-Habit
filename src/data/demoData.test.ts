import { describe, expect, it } from "vitest";
import { createDemoLogs } from "./demoData";

describe("jeu de démonstration", () => {
  it("ne sérialise jamais les statuts vides", () => {
    expect(createDemoLogs().some((log) => log.status === "empty")).toBe(false);
  });
});
