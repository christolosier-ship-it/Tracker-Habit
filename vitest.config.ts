import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      all: true,
      include: [
        "src/analytics/**/*.ts",
        "src/domain/**/*.ts",
        "src/persistence/**/*.ts",
        "src/app/tracker-{events,reducer}.ts",
        "src/components/stats/stats-display-utils.ts",
      ],
      exclude: ["src/**/*.test.ts"],
      reporter: ["text", "json-summary"],
      thresholds: {
        statements: 85,
        branches: 80,
        functions: 85,
        lines: 85,
      },
    },
  },
});
