import CDP from "chrome-remote-interface";
import { writeFileSync } from "node:fs";

const errors = [];
const consoleMessages = [];
const networkFailures = [];

const client = await CDP({ port: 9222 });
const { Runtime, Page, Network } = client;

Runtime.exceptionThrown(({ exceptionDetails }) => {
  errors.push({
    text: exceptionDetails.text,
    url: exceptionDetails.url,
    lineNumber: exceptionDetails.lineNumber,
    columnNumber: exceptionDetails.columnNumber,
    exception: exceptionDetails.exception?.description,
    stackTrace: exceptionDetails.stackTrace,
  });
});

Runtime.consoleAPICalled(({ type, args }) => {
  consoleMessages.push({
    type,
    values: args.map((arg) => arg.value ?? arg.description),
  });
});

Network.loadingFailed((event) => {
  networkFailures.push({
    errorText: event.errorText,
    canceled: event.canceled,
    type: event.type,
  });
});

await Promise.all([Runtime.enable(), Page.enable(), Network.enable()]);
await Page.navigate({ url: "http://127.0.0.1:4173/Tracker-Habit/" });
await Page.loadEventFired();
await new Promise((resolve) => setTimeout(resolve, 5000));

const { result } = await Runtime.evaluate({
  expression: `JSON.stringify({
    html: document.documentElement.outerHTML,
    root: document.getElementById('root')?.innerHTML,
    title: document.title,
    scripts: [...document.scripts].map((script) => script.src),
    links: [...document.querySelectorAll('link[rel="stylesheet"]')].map((link) => link.href),
  })`,
  returnByValue: true,
});

const page = JSON.parse(result.value ?? "{}");
writeFileSync(
  "runtime-report.json",
  JSON.stringify({ errors, consoleMessages, networkFailures, page }, null, 2),
);
writeFileSync("dom.html", page.html ?? "");

console.log(JSON.stringify({ errors, consoleMessages, networkFailures, rootLength: page.root?.length ?? 0 }, null, 2));
await client.close();

if (!page.root || page.root.length < 100 || errors.length > 0 || networkFailures.length > 0) {
  process.exit(1);
}
