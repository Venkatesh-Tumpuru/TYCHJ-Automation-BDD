import { Before, After, Status } from "@cucumber/cucumber";
import BrowserManager from "../utils/browserManager";
import fs from "fs";
import path from "path";
import type { ConsoleMessage } from "playwright";

let browserManager: BrowserManager;

Before(async function () {
  browserManager = new BrowserManager();
  await browserManager.launch();
  this.page = browserManager.page;

  // typed listener stored locally
  this.page.on("console", (msg: ConsoleMessage) => {
    (this.page as any)._consoleLogs =
      ((this.page as any)._consoleLogs || "") + `[${msg.type()}] ${msg.text()}\n`;
  });

  this.page.on("pageerror", (err: Error) => {
    (this.page as any)._pageErrors =
      ((this.page as any)._pageErrors || "") + (err?.message || String(err)) + "\n";
  });
});

After(async function (scenario) {
  // ... attachments, screenshot, close browser, etc.
  await browserManager.close();
});
