import CDP from "chrome-remote-interface";
import { writeFileSync } from "node:fs";

const errors = [];
const consoleMessages = [];
const networkFailures = [];
const requests = new Map();
const responses = [];

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

Network.requestWillBeSent(({ requestId, request, type }) => {
  requests.set(requestId, { url: request.url, method: request.method, type });
});

Network.responseReceived(({ requestId, response, type }) => {
  responses.push({
    requestId,
    url: response.url,
    status: response.status,
    mimeType: response.mimeType,
    type,
  });
});

Network.loadingFailed((event) => {
  networkFailures.push({
    ...requests.get(event.requestId),
    requestId: event.requestId,
    errorText: event.errorText,
    canceled: event.canceled,
    type: event.type,
  });
});

await Promise.all([Runtime.enable(), Page.enable(), Network.enable()]);
await Page.navigate({ url: "http://127.0.0.1:4173/Tracker-Habit/" });
await new Promise((resolve) => setTimeout(resolve, 7000));

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
const report = {
  errors,
  consoleMessages,
  networkFailures,
  responses,
  requests: [...requests.values()],
  page,
};
writeFileSync("runtime-report.json", JSON.stringify(report, null, 2));
writeFileSync("dom.html", page.html ?? "");

console.log(
  JSON.stringify(
    {
      errors,
      consoleMessages,
      networkFailures,
      responses,
      rootLength: page.root?.length ?? 0,
    },
    null,
    2,
  ),
);
await client.close();

if (!page.root || page.root.length < 100 || errors.length > 0) {
  process.exit(1);
}
