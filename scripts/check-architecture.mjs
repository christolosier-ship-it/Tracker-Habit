import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const failures = [];
const requiredPaths = [
  "src/analytics/tracker-analytics.ts",
  "src/analytics/tracker-index.ts",
  "src/domain/definitions.ts",
  "src/domain/evaluation.ts",
  "src/domain/tracker-reducer.ts",
  "src/persistence/schema.ts",
  "src/persistence/migrations.ts",
  "src/persistence/local-storage.ts",
  "src/styles/foundations.css",
  "src/styles/layout.css",
  "src/styles/components.css",
  "src/styles/charts.css",
  "src/styles/themes.css",
  "src/styles/responsive.css",
];
const forbiddenPaths = [
  "src/app/pages.tsx",
  "src/app/shared.tsx",
  "src/lib/storage.ts",
  "src/lib/log-index.ts",
  "src/pages/index.ts",
  "src/features/mascot/DashboardMascot.tsx",
  "tailwind.config.ts",
  ".github/workflows/generate-lock.yml",
];

for (const path of requiredPaths) {
  if (!existsSync(join(root, path))) failures.push(`Fichier requis absent : ${path}`);
}
for (const path of forbiddenPaths) {
  if (existsSync(join(root, path))) failures.push(`Fichier historique interdit : ${path}`);
}

const presetDirectory = join(root, "src/themes/presets");
const presets = readdirSync(presetDirectory).filter((file) => file.endsWith(".ts"));
if (presets.length !== 12) failures.push(`12 presets attendus, ${presets.length} trouvés.`);
for (const file of presets) {
  if (!readFileSync(join(presetDirectory, file), "utf8").includes("defineTheme(")) {
    failures.push(`Preset sans defineTheme : ${file}`);
  }
}

const sourceFiles = [];
function collect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) collect(path);
    else if (/\.(ts|tsx|css)$/.test(entry.name)) sourceFiles.push(path);
  }
}
collect(join(root, "src"));

const forbiddenFragments = [
  "@tremor/react",
  "getTremorColors",
  "tailwind-merge",
  "date-fns",
  "dashboard-mascot",
  "theme-identity-layer",
  "window.gsap",
];
for (const file of sourceFiles) {
  const content = readFileSync(file, "utf8");
  for (const fragment of forbiddenFragments) {
    if (content.includes(fragment)) {
      failures.push(`${fragment} encore présent dans ${relative(root, file)}`);
    }
  }
}

const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
for (const dependency of [
  "@tremor/react",
  "framer-motion",
  "tailwindcss",
  "tailwind-merge",
  "date-fns",
  "class-variance-authority",
  "clsx",
]) {
  if (
    packageJson.dependencies?.[dependency] ||
    packageJson.devDependencies?.[dependency]
  ) {
    failures.push(`Dépendance inutile encore déclarée : ${dependency}`);
  }
}

const main = readFileSync(join(root, "src/main.tsx"), "utf8");
if (!main.includes('import "./styles/index.css";')) {
  failures.push("main.tsx doit charger uniquement src/styles/index.css");
}

if (failures.length) {
  console.error(`Architecture non conforme :\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(
  "Architecture conforme : domaine, analytics, persistance, pages, thèmes et styles sont séparés.",
);
