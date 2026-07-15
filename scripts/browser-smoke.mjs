import { existsSync } from "node:fs";
import puppeteer from "puppeteer-core";

const executablePath =
  process.env.CHROME_BIN ??
  [
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].find(existsSync);

if (!executablePath) {
  console.error("Chrome ou Chromium est requis pour le smoke test navigateur.");
  process.exit(1);
}

const url = process.env.PREVIEW_URL ?? "http://127.0.0.1:4173/Tracker-Habit/";
const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

const page = await browser.newPage();
const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

async function clickNavigation(label) {
  const clicked = await page.$$eval(
    ".sidebar > button",
    (buttons, expected) => {
      const target = buttons.find(
        (button) => button.textContent?.trim() === expected,
      );
      if (!target || typeof target.click !== "function") return false;
      target.click();
      return true;
    },
    label,
  );
  if (!clicked) throw new Error(`Navigation introuvable : ${label}`);
}

async function assertStickyColumn({ container, label, name }) {
  await page.$eval(container, (element) => {
    element.scrollLeft = element.scrollWidth;
  });
  await wait(80);
  const state = await page.$eval(
    container,
    (element, labelSelector) => {
      const stickyLabel = element.querySelector(labelSelector);
      if (!stickyLabel) return { error: "colonne figée introuvable" };
      const rect = stickyLabel.getBoundingClientRect();
      const hit = globalThis.document.elementFromPoint(
        Math.min(rect.right - 4, rect.left + 20),
        rect.top + rect.height / 2,
      );
      return {
        scrollLeft: element.scrollLeft,
        hitIsLabel: hit === stickyLabel || stickyLabel.contains(hit),
        labelTag: stickyLabel.tagName,
      };
    },
    label,
  );
  if (state.error || state.scrollLeft <= 0 || !state.hitIsLabel) {
    throw new Error(`${name} invalide : ${JSON.stringify(state)}`);
  }
}

try {
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector(".app-shell");
  await page.waitForSelector(".annual-matrix");

  const periodHeight = await page.$eval(
    ".period-controls",
    (element) => element.getBoundingClientRect().height,
  );
  if (periodHeight > 90) {
    throw new Error(`Contrôles de période trop hauts : ${periodHeight}px`);
  }

  await assertStickyColumn({
    container: ".annual-matrix-card .ui-card-content",
    label: ".annual-matrix > span",
    name: "Colonne Habitude du dashboard",
  });

  await clickNavigation("Mois");
  await page.waitForSelector(".month-grid");
  const monthCellTags = await page.$$eval(
    ".month-grid > .theme-calendar-cell",
    (cells) => [...new Set(cells.map((cell) => cell.tagName))],
  );
  if (monthCellTags.includes("SPAN")) {
    throw new Error(
      `Les cellules mensuelles non interactives utilisent encore un span : ${monthCellTags.join(", ")}`,
    );
  }
  await assertStickyColumn({
    container: ".month-grid",
    label: ".month-grid > span",
    name: "Colonne Habitude de la vue Mois",
  });

  await clickNavigation("Statistiques");
  await page.waitForSelector(".status-breakdown-vertical");
  const statusLayout = await page.$eval(".status-breakdown-vertical", (element) => {
    const chart = element.querySelector(".status-breakdown-chart");
    const legend = element.querySelector(".status-legend");
    if (!chart || !legend) return { error: "graphique ou légende introuvable" };
    const chartRect = chart.getBoundingClientRect();
    const legendRect = legend.getBoundingClientRect();
    return {
      chartBottom: chartRect.bottom,
      legendTop: legendRect.top,
      legendInside: legendRect.right <= element.getBoundingClientRect().right + 1,
    };
  });
  if (
    statusLayout.error ||
    statusLayout.legendTop < statusLayout.chartBottom ||
    !statusLayout.legendInside
  ) {
    throw new Error(`Répartition des statuts tronquée : ${JSON.stringify(statusLayout)}`);
  }

  await clickNavigation("Aujourd’hui");
  await page.waitForSelector(".status-button");
  if (await page.$(".period-controls")) {
    throw new Error("La page Aujourd’hui expose encore des contrôles de période inutiles.");
  }
  const initialStatus = await page.$eval(
    ".status-button",
    (button) => button.textContent?.trim(),
  );
  await page.click(".status-button");
  const changedStatus = await page.$eval(
    ".status-button",
    (button) => button.textContent?.trim(),
  );
  if (!changedStatus || changedStatus === initialStatus) {
    throw new Error("Le statut ne change pas après interaction.");
  }

  await wait(550);
  await page.reload({ waitUntil: "networkidle0" });
  await clickNavigation("Aujourd’hui");
  await page.waitForSelector(".status-button");
  const persistedStatus = await page.$eval(
    ".status-button",
    (button) => button.textContent?.trim(),
  );
  if (persistedStatus !== changedStatus) {
    throw new Error("Le statut n’est pas restauré après rechargement.");
  }

  await clickNavigation("Paramètres");
  await page.waitForSelector(".theme-card");
  if (await page.$(".period-controls")) {
    throw new Error("Les paramètres exposent encore des contrôles de période inutiles.");
  }
  const themePreviewState = await page.$$eval(".theme-card", (cards) => {
    const aurora = cards[3];
    const descriptions = cards.map(
      (card) => card.querySelector(".theme-card-copy span")?.textContent?.trim() ?? "",
    );
    return {
      descriptions,
      auroraBackground: aurora?.style.background ?? "",
    };
  });
  if (
    themePreviewState.descriptions.some((description) => !description) ||
    !themePreviewState.descriptions[3]?.startsWith("Verre doux") ||
    !themePreviewState.auroraBackground
  ) {
    throw new Error(`Aperçus de thèmes invalides : ${JSON.stringify(themePreviewState)}`);
  }
  const previousTheme = await page.$eval(".app-shell", (shell) => shell.getAttribute("data-theme"));
  await page.$$eval(".theme-card", (cards) => {
    const target = cards[1];
    if (target && typeof target.click === "function") target.click();
  });
  await page.waitForFunction(
    (theme) =>
      globalThis.document
        .querySelector(".app-shell")
        ?.getAttribute("data-theme") !== theme,
    {},
    previousTheme,
  );
  const mascotToggle = await page.$$(".tracking-options-panel input[type=checkbox]");
  if (mascotToggle.length < 2) {
    throw new Error("Le réglage de la mascotte est introuvable.");
  }
  await mascotToggle[1].click();
  await page.waitForFunction(
    () => !globalThis.document.querySelector(".roaming-mascot-layer"),
  );

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await clickNavigation("Mois");
  await page.waitForSelector(".mobile-month-list");
  const mobileLayout = await page.evaluate(() => ({
    hasMobileList: Boolean(
      globalThis.document.querySelector(".mobile-month-list"),
    ),
    hasDesktopGrid: Boolean(globalThis.document.querySelector(".month-grid")),
    overflow:
      globalThis.document.documentElement.scrollWidth >
      globalThis.window.innerWidth + 1,
  }));
  if (!mobileLayout.hasMobileList || mobileLayout.hasDesktopGrid || mobileLayout.overflow) {
    throw new Error(`Layout mobile invalide : ${JSON.stringify(mobileLayout)}`);
  }

  console.log(
    "Smoke navigateur conforme : navigation, persistance, colonnes figées, statistiques, thèmes, mascotte et mobile.",
  );
} finally {
  await browser.close();
}
