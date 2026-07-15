import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const assets = join(process.cwd(), "dist", "assets");
const files = readdirSync(assets);
const javascript = files.filter((file) => file.endsWith(".js"));
const styles = files.filter((file) => file.endsWith(".css"));
const mascotChunks = javascript.filter((file) => /Mascot-/.test(file));
const mainChunk = javascript.find((file) => file.startsWith("index-"));
const failures = [];

function size(file) {
  return statSync(join(assets, file)).size;
}

function gzipSize(file) {
  return gzipSync(readFileSync(join(assets, file))).length;
}

function total(list, measure) {
  return list.reduce((sum, file) => sum + measure(file), 0);
}

if (mascotChunks.length !== 12) {
  failures.push(`12 chunks de mascotte attendus, ${mascotChunks.length} trouvés`);
}
for (const file of mascotChunks) {
  if (size(file) > 20_000) failures.push(`${file} dépasse 20 ko`);
}

if (!mainChunk) failures.push("Chunk principal introuvable");
else if (size(mainChunk) > 220_000) {
  failures.push(`Chunk principal trop lourd : ${size(mainChunk)} octets`);
}

const largestJavascript = javascript
  .map((file) => ({ file, bytes: size(file) }))
  .sort((left, right) => right.bytes - left.bytes)[0];
const jsBytes = total(javascript, size);
const jsGzip = total(javascript, gzipSize);
const cssBytes = total(styles, size);
const cssGzip = total(styles, gzipSize);

if (largestJavascript.bytes > 220_000) {
  failures.push(
    `Plus gros chunk trop lourd : ${largestJavascript.file} (${largestJavascript.bytes})`,
  );
}
if (jsBytes > 500_000) failures.push(`JavaScript total trop lourd : ${jsBytes}`);
if (jsGzip > 165_000) failures.push(`JavaScript gzip total trop lourd : ${jsGzip}`);
if (cssBytes > 85_000) failures.push(`CSS total trop lourd : ${cssBytes}`);
if (cssGzip > 19_000) failures.push(`CSS gzip total trop lourd : ${cssGzip}`);

if (failures.length) {
  console.error(`Budget bundle dépassé :\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Bundle conforme : JS ${jsBytes} (${jsGzip} gzip), CSS ${cssBytes} (${cssGzip} gzip), max ${largestJavascript.file} ${largestJavascript.bytes}.`,
);
