import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import postcss from "postcss";

const root = process.cwd();
const styleDirectory = join(root, "src/styles");
const styleFiles = [
  "foundations.css",
  "layout.css",
  "components.css",
  "charts.css",
  "themes.css",
  "responsive.css",
];
const failures = [];
const index = readFileSync(join(styleDirectory, "index.css"), "utf8");
const imports = [...index.matchAll(/@import\s+["']\.\/([^"']+)["'];/g)].map(
  (match) => match[1],
);

if (JSON.stringify(imports) !== JSON.stringify(styleFiles)) {
  failures.push(`Ordre des couches CSS inattendu : ${imports.join(", ")}`);
}

let bytes = Buffer.byteLength(index);
let rules = 0;
let declarations = 0;
let important = 0;
let combined = index;

for (const file of styleFiles) {
  const path = join(styleDirectory, file);
  const source = readFileSync(path, "utf8");
  bytes += statSync(path).size;
  combined += source;
  const tree = postcss.parse(source, { from: path });
  tree.walkRules(() => {
    rules += 1;
  });
  tree.walkDecls((declaration) => {
    declarations += 1;
    if (declaration.important) important += 1;
  });
}

if (bytes > 42_000) failures.push(`CSS source trop lourd : ${bytes} octets`);
if (rules > 320) failures.push(`Trop de règles CSS : ${rules}`);
if (declarations > 1_050) failures.push(`Trop de déclarations CSS : ${declarations}`);
if (important > 3) failures.push(`Trop de !important : ${important}`);

const forbidden = [
  "tremor",
  "theme-identity-layer",
  "theme-signature-widget",
  "system-status-widget",
  "mood-bubble-widget",
  "dashboard-mascot",
  "styles-density-pass",
];
for (const fragment of forbidden) {
  if (combined.includes(fragment)) failures.push(`Reliquat CSS interdit : ${fragment}`);
}

if (failures.length) {
  console.error(`CSS non conforme :\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `CSS conforme : ${bytes} octets, ${rules} règles, ${declarations} déclarations, ${important} !important.`,
);
