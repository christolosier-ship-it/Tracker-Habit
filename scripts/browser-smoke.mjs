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

try {
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector(".app-shell");

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
    "Smoke navigateur conforme : navigation, persistance, pages ciblées, thème, mascotte et mobile.",
  );
} finally {
  await browser.close();
}
