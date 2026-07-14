import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const assets = join(process.cwd(), "dist", "assets");
const files = readdirSync(assets);
const js = files.filter((file) => file.endsWith(".js"));
const mascotChunks = js.filter((file) => /Mascot-/.test(file));
const mainChunk = js.find((file) => file.startsWith("index-"));
const failures = [];

if (mascotChunks.length !== 12) failures.push(`12 chunks de mascotte attendus, ${mascotChunks.length} trouvés`);
for (const file of mascotChunks) {
  const size = statSync(join(assets, file)).size;
  if (size > 140_000) failures.push(`${file} dépasse 140 ko (${size} octets)`);
}
if (!mainChunk) failures.push("Chunk principal introuvable");
else {
  const size = statSync(join(assets, mainChunk)).size;
  if (size > 260_000) failures.push(`Chunk principal trop lourd : ${size} octets`);
}
if (failures.length) {
  console.error("Budget bundle dépassé :\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log(`Budget bundle conforme : ${mascotChunks.length} mascottes lazy, principal ${statSync(join(assets, mainChunk)).size} octets.`);
