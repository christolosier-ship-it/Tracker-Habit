import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const failures = [];

for (const forbiddenPath of ["src/app/pages.tsx", "src/app/shared.tsx"]) {
  if (existsSync(join(root, forbiddenPath))) {
    failures.push(`Fichier monolithique interdit : ${forbiddenPath}`);
  }
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
];

for (const file of sourceFiles) {
  const content = readFileSync(file, "utf8");
  for (const fragment of forbiddenFragments) {
    if (content.includes(fragment)) {
      failures.push(`${fragment} encore présent dans ${file.slice(root.length + 1)}`);
    }
  }
}

if (failures.length) {
  console.error("Architecture non conforme :\n- " + failures.join("\n- "));
  process.exit(1);
}

console.log("Architecture conforme : presets réels, monolithes retirés, reliquats supprimés.");
