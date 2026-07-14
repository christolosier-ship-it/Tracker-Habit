import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const failures = [];

const forbiddenPaths = [
  "src/app/pages.tsx",
  "src/app/shared.tsx",
  "src/styles.css",
  "src/styles-cleanup.css",
  "src/responsive-layout-charts.css",
  "src/styles-density-pass.css",
];

for (const forbiddenPath of forbiddenPaths) {
  if (existsSync(join(root, forbiddenPath))) {
    failures.push(`Fichier historique interdit : ${forbiddenPath}`);
  }
}

if (!existsSync(join(root, "src/styles/index.css"))) {
  failures.push("Feuille consolidée absente : src/styles/index.css");
}

const presetDirectory = join(root, "src/themes/presets");
const presets = readdirSync(presetDirectory).filter((file) => file.endsWith(".ts"));
if (presets.length !== 12) {
  failures.push(`12 presets attendus, ${presets.length} trouvés.`);
}

for (const file of presets) {
  const content = readFileSync(join(presetDirectory, file), "utf8");
  if (!content.includes("defineTheme(")) {
    failures.push(`Preset sans définition de thème : ${file}`);
  }
}

const sourceFiles = [];
function collect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) collect(path);
    else if (/\.(ts|tsx)$/.test(entry.name)) sourceFiles.push(path);
  }
}
collect(join(root, "src"));

const forbiddenFragments = [
  "@tremor/react",
  "getTremorColors",
  "signatureWidget",
  "identity.hero",
  "identity.decoration",
  "TremorPanel",
  "tremor-panel",
];

for (const file of sourceFiles) {
  const content = readFileSync(file, "utf8");
  for (const fragment of forbiddenFragments) {
    if (content.includes(fragment)) {
      failures.push(`${fragment} encore présent dans ${file.slice(root.length + 1)}`);
    }
  }
}

const packageJson = JSON.parse(
  readFileSync(join(root, "package.json"), "utf8"),
);
for (const dependency of ["@tremor/react", "framer-motion"]) {
  if (packageJson.dependencies?.[dependency] || packageJson.devDependencies?.[dependency]) {
    failures.push(`Dépendance inutilisée encore déclarée : ${dependency}`);
  }
}


const mascotDirectory = join(root, "src/features/mascot");
const mascotFiles = [];
function collectMascotFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) collectMascotFiles(path);
    else mascotFiles.push(path);
  }
}
collectMascotFiles(mascotDirectory);

for (const file of mascotFiles) {
  const content = readFileSync(file, "utf8");
  const relative = file.slice(root.length + 1);
  if (content.includes("window.gsap")) failures.push(`GSAP global interdit : ${relative}`);
  if (/creatures\/use[A-Z][A-Za-z]+Reaction\.ts$/.test(relative)) failures.push(`Hook de réaction individuel interdit : ${relative}`);
}

const indexHtml = readFileSync(join(root, "index.html"), "utf8");
if (indexHtml.includes("cdn.jsdelivr.net/npm/gsap")) failures.push("Le CDN GSAP ne doit plus être utilisé.");
if (!packageJson.dependencies?.gsap) failures.push("GSAP doit être déclaré comme dépendance npm.");

const main = readFileSync(join(root, "src/main.tsx"), "utf8");
if (!main.includes('import "./styles/index.css";')) {
  failures.push("main.tsx doit charger uniquement src/styles/index.css");
}

if (failures.length) {
  console.error("Architecture non conforme :\n- " + failures.join("\n- "));
  process.exit(1);
}

console.log(
  "Architecture conforme : presets réels, pages modulaires, CSS consolidé et reliquats supprimés.",
);
