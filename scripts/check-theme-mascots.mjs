import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const mascotDirectory = join(root, "public", "mascots", "previews");
const themeIdsSource = readFileSync(join(root, "src", "themes", "theme-ids.ts"), "utf8");
const themeIdsBlock = themeIdsSource.match(/export const THEME_IDS = \[([\s\S]*?)\] as const;/)?.[1] ?? "";
const themeIds = [...themeIdsBlock.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
const expectedFiles = themeIds.map((id) => `${id}.webp`).sort();
const actualFiles = readdirSync(mascotDirectory).sort();
const failures = [];

if (themeIds.length !== 12) {
  failures.push(`12 identifiants de thème attendus, ${themeIds.length} trouvés`);
}
if (JSON.stringify(actualFiles) !== JSON.stringify(expectedFiles)) {
  failures.push(
    `Le dossier des mascottes ne correspond pas aux thèmes : ${actualFiles.join(", ")}`,
  );
}

let totalBytes = 0;
for (const file of expectedFiles) {
  const path = join(mascotDirectory, file);
  const source = readFileSync(path);
  const bytes = statSync(path).size;
  totalBytes += bytes;

  if (
    source.toString("ascii", 0, 4) !== "RIFF" ||
    source.toString("ascii", 8, 12) !== "WEBP" ||
    source.toString("ascii", 12, 16) !== "VP8X"
  ) {
    failures.push(`${file} n'est pas un WebP étendu valide`);
    continue;
  }

  const hasAlpha = (source[20] & 0x10) !== 0;
  const width = source.readUIntLE(24, 3) + 1;
  const height = source.readUIntLE(27, 3) + 1;
  if (!hasAlpha) failures.push(`${file} ne possède pas de transparence`);
  if (width !== height || width < 256 || width > 512) {
    failures.push(`${file} a des dimensions invalides : ${width}x${height}`);
  }
  if (bytes < 1_000 || bytes > 100_000) {
    failures.push(`${file} a un poids invalide : ${bytes} octets`);
  }
}

const previewSource = readFileSync(
  join(root, "src", "components", "theme-identity", "ThemePreview.tsx"),
  "utf8",
);
if (!previewSource.includes("mascots/previews/${theme.id}.webp")) {
  failures.push("Le chemin des mascottes n'est pas dérivé de l'identifiant du thème");
}
if (!previewSource.includes('loading="lazy"') || !previewSource.includes('decoding="async"')) {
  failures.push("Le chargement différé des mascottes n'est pas configuré");
}
if (!previewSource.includes("event.currentTarget.hidden = true")) {
  failures.push("Le fallback d'image manquante n'est pas configuré");
}

if (failures.length) {
  console.error(`Mascottes non conformes :\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Mascottes conformes : ${expectedFiles.length} WebP transparents, ${totalBytes} octets au total.`,
);
