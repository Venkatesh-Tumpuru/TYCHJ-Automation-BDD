import { BeforeAll } from "@cucumber/cucumber";
import fs from "fs";
import path from "path";

function clean(target: string) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
    console.log(`🧹 Cleaned: ${target}`);
  } else {
    console.log(`ℹ️ Not found (skipped): ${target}`);
  }
}

BeforeAll(() => {
  console.log("🧹 Running pre-test cleanup...");

  const foldersToClean = [
    path.resolve("src/reports/screenshots"),
    path.resolve("src/reports/videos"),
    // path.resolve("src/reports/allure-results"),
    // path.resolve("src/reports/allure-report"),
    // path.resolve("src/reports/cucumber-report.json")
  ];

  foldersToClean.forEach(clean);

  console.log("✨ Pre-test cleanup finished!");
});
