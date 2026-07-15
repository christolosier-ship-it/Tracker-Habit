import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";

const root = process.cwd();
const sourceRoot = join(root, "src");
const modules = [];

function collect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) collect(path);
    else if (/\.(ts|tsx)$/.test(entry.name)) modules.push(path);
  }
}

function resolveImport(importer, specifier) {
  if (!specifier.startsWith(".")) return null;
  const base = resolve(dirname(importer), specifier);
  const candidates = extname(base)
    ? [base]
    : [
        `${base}.ts`,
        `${base}.tsx`,
        join(base, "index.ts"),
        join(base, "index.tsx"),
      ];
  return candidates.find(existsSync) ?? null;
}

collect(sourceRoot);
const graph = new Map(modules.map((module) => [module, []]));
let edgeCount = 0;

for (const module of modules) {
  const source = readFileSync(module, "utf8");
  const specifiers = [
    ...source.matchAll(/(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g),
    ...source.matchAll(/import\(\s*["']([^"']+)["']\s*\)/g),
  ].map((match) => match[1]);
  for (const specifier of new Set(specifiers)) {
    const dependency = resolveImport(module, specifier);
    if (dependency && graph.has(dependency)) {
      graph.get(module).push(dependency);
      edgeCount += 1;
    }
  }
}

const visited = new Set();
const active = new Set();
const stack = [];
const cycles = [];

function visit(module) {
  if (active.has(module)) {
    const start = stack.indexOf(module);
    cycles.push([...stack.slice(start), module]);
    return;
  }
  if (visited.has(module)) return;
  visited.add(module);
  active.add(module);
  stack.push(module);
  for (const dependency of graph.get(module)) visit(dependency);
  stack.pop();
  active.delete(module);
}

for (const module of modules) visit(module);

if (cycles.length) {
  console.error(
    `Cycles détectés :\n${cycles
      .map((cycle) =>
        cycle.map((file) => relative(root, file)).join(" -> "),
      )
      .join("\n")}`,
  );
  process.exit(1);
}

console.log(`Graphe acyclique : ${modules.length} modules, ${edgeCount} dépendances internes.`);
