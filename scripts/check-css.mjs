import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import postcss from "postcss";

const root = process.cwd();
const sourceDirectory = join(root, "src");
const styleDirectory = join(sourceDirectory, "styles");
const styleLayers = [
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

if (JSON.stringify(imports) !== JSON.stringify(styleLayers)) {
  failures.push(`Ordre des couches CSS inattendu : ${imports.join(", ")}`);
}

const cssFiles = [];
function collectCss(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) collectCss(path);
    else if (entry.name.endsWith(".css")) cssFiles.push(path);
  }
}
collectCss(sourceDirectory);

let bytes = 0;
let rules = 0;
let declarations = 0;
let important = 0;
let combined = "";

for (const path of cssFiles) {
  const source = readFileSync(path, "utf8");
  const file = relative(root, path);
  bytes += statSync(path).size;
  combined += `\n${source}`;
  if (source.length > 1_000 && source.split("\n").length < 8) {
    failures.push(`CSS minifié dans les sources : ${file}`);
  }
  const tree = postcss.parse(source, { from: path });
  tree.walkRules(() => {
    rules += 1;
  });
  tree.walkDecls((declaration) => {
    declarations += 1;
    if (declaration.important) important += 1;
  });
}

if (bytes > 100_000) failures.push(`CSS source trop lourd : ${bytes} octets`);
if (rules > 900) failures.push(`Trop de règles CSS : ${rules}`);
if (declarations > 2_200) failures.push(`Trop de déclarations CSS : ${declarations}`);
if (important > 30) failures.push(`Trop de !important : ${important}`);

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
  `CSS conforme : ${cssFiles.length} fichiers, ${bytes} octets, ${rules} règles, ${declarations} déclarations, ${important} !important.`,
);
