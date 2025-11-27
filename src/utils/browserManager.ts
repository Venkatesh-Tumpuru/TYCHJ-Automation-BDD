// src/utils/browserManager.ts
import { chromium, firefox, webkit, Browser, BrowserContext, Page, BrowserType } from "playwright";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

export class BrowserManager {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  async launch() {
    const browserTypeStr = (process.env.BROWSER || "chromium").toLowerCase();
    const headless = (process.env.HEADLESS || "true") === "true";
    const workerId = process.env.CUCUMBER_WORKER_ID || "0";

    const browserType: BrowserType<Browser> =
      browserTypeStr === "firefox" ? firefox :
      browserTypeStr === "webkit" ? webkit :
      chromium;

    // launch browser
    this.browser = await browserType.launch({ headless });

    // per-worker video dir
    const videoDir = `src/reports/videos/worker-${workerId}`;
    if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

    this.context = await this.browser.newContext({
      recordVideo: { dir: videoDir }
    });

    this.page = await this.context.newPage();

    // collect console logs and page errors on the page object
    this.page.on("console", msg => {
      (this.page as any)._consoleLogs =
        ((this.page as any)._consoleLogs || "") + `[${msg.type()}] ${msg.text()}\n`;
    });

    this.page.on("pageerror", err => {
      (this.page as any)._pageErrors =
        ((this.page as any)._pageErrors || "") + err.message + "\n" + (err.stack || "") + "\n";
    });

    return this.page;
  }

  async close() {
    try {
      await this.context.close();
    } catch (e) {}
    try {
      await this.browser.close();
    } catch (e) {}
  }
}
export default BrowserManager;
