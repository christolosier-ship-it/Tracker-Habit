import { expect, it } from "vitest";
import { selectDashboardStats } from "../lib/dashboard-selectors";
import { demoData } from "../persistence";

it("calcule le Dashboard en moins de 50 ms en médiane sur la démo", () => {
  const data = demoData();
  const now = new Date();

  selectDashboardStats(data, now);
  const samples = Array.from({ length: 9 }, () => {
    const start = performance.now();
    selectDashboardStats(data, now);
    return performance.now() - start;
  }).sort((left, right) => left - right);
  const median = samples[Math.floor(samples.length / 2)];

  expect(
    median,
    `La médiane du sélecteur Dashboard est de ${median.toFixed(1)} ms`,
  ).toBeLessThan(50);
});
