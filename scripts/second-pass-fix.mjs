import fs from "node:fs";

function edit(path, transform) {
  const before = fs.readFileSync(path, "utf8");
  const after = transform(before);
  if (after === before) throw new Error(`Aucune modification appliquée à ${path}`);
  fs.writeFileSync(path, after);
}

edit("src/app/pages.tsx", (source) =>
  source
    .replace('import { Habit, UserSettings } from "../types";', 'import { Habit } from "../types";')
    .replace(
      '  monthShortLabels,\n} from "./constants";',
      '  monthShortLabels,\n  statusSymbol,\n} from "./constants";',
    )
    .replace('  statusSymbol,\n  TremorPanel,', '  TremorPanel,')
    .replace('<Badge variant="muted">LocalStorage V1</Badge>', '<Badge variant="muted">LocalStorage V3</Badge>')
    .replace('<AntiProcrastination data={data} theme={theme} stats={stats} />', '<AntiProcrastination theme={theme} stats={stats} />'),
);

edit("src/app/constants.ts", (source) =>
  source
    .replace('import type React from "react";', 'import type React from "react";\nimport type { HabitStatus } from "../types";')
    .replace(
      'export const formatPercent = (value: number) => `${Math.round(value)}%`;',
      'export const formatPercent = (value: number) => `${Math.round(value)}%`;\n\nexport function statusSymbol(status: HabitStatus) {\n  if (status === "done") return "✓";\n  if (status === "partial") return "◐";\n  if (status === "missed") return "×";\n  if (status === "rest") return "Ⅱ";\n  return "·";\n}',
    ),
);

edit("src/app/shared.tsx", (source) =>
  source
    .replace('export function AntiProcrastination({\n  data: _data,\n  theme,\n  stats,\n}: {\n  data?: AppData;\n  theme: AppTheme;\n  stats: DashboardStats;\n}) {', 'export function AntiProcrastination({\n  theme,\n  stats,\n}: {\n  theme: AppTheme;\n  stats: DashboardStats;\n}) {')
    .replace(/\nexport function statusSymbol\(status: HabitStatus\) \{[\s\S]*?\n\}\n?$/, "\n"),
);

const pagesUrlExpression = "$" + "{{ steps.deployment.outputs.page_url }}";
fs.writeFileSync(
  ".github/workflows/deploy.yml",
  `name: Deploy GitHub Pages\n\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n  workflow_dispatch:\n\npermissions:\n  contents: read\n  pages: write\n  id-token: write\n\nconcurrency:\n  group: pages\n  cancel-in-progress: false\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Checkout\n        uses: actions/checkout@v4\n      - name: Setup Node\n        uses: actions/setup-node@v4\n        with:\n          node-version: 22\n          cache: npm\n      - name: Install dependencies\n        run: npm ci\n      - name: Quality checks\n        run: npm run check\n      - name: Upload Pages artifact\n        if: github.event_name == 'push' && github.ref == 'refs/heads/main'\n        uses: actions/upload-pages-artifact@v3\n        with:\n          path: dist\n\n  deploy:\n    if: github.event_name == 'push' && github.ref == 'refs/heads/main'\n    needs: build\n    runs-on: ubuntu-latest\n    environment:\n      name: github-pages\n      url: ${pagesUrlExpression}\n    steps:\n      - name: Deploy to GitHub Pages\n        id: deployment\n        uses: actions/deploy-pages@v4\n`,
);

fs.rmSync("scripts/second-pass-fix.mjs");
fs.rmSync(".github/workflows/second-pass-fix.yml");
