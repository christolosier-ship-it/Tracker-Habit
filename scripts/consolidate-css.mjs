import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// Conserve strictement l’ordre de cascade validé avant de supprimer les fichiers historiques.
const root = process.cwd();
const sources = [
  ["Fondations, composants et thèmes", "src/styles.css"],
  ["Correctifs de composants validés", "src/styles-cleanup.css"],
  ["Layout responsive et graphiques", "src/responsive-layout-charts.css"],
  ["Densité finale de l’interface", "src/styles-density-pass.css"],
];

const sections = sources.map(([title, relativePath]) => {
  const path = join(root, relativePath);
  const content = readFileSync(path, "utf8")
    .replaceAll("tremor-panel", "chart-panel")
    .replace(/\/\* Correctifs structurels[^*]*\*\//g, "")
    .replace(/\/\* Passe de dégraissage[^*]*\*\//g, "")
    .trim();
  return `/* ==========================================================================\n   ${title}\n   ========================================================================== */\n\n${content}`;
});

const target = join(root, "src/styles/index.css");
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, `${sections.join("\n\n")}\n`, "utf8");

const mainPath = join(root, "src/main.tsx");
const main = readFileSync(mainPath, "utf8").replace(
  /import "\.\/styles\.css";\nimport "\.\/styles-cleanup\.css";\nimport "\.\/responsive-layout-charts\.css";\nimport "\.\/styles-density-pass\.css";/,
  'import "./styles/index.css";',
);
writeFileSync(mainPath, main, "utf8");

for (const [, relativePath] of sources) {
  rmSync(join(root, relativePath));
}

console.log("CSS consolidé dans src/styles/index.css sans modifier l’ordre de cascade.");
