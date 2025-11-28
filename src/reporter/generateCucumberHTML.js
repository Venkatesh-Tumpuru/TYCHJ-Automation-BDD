const reporter = require("multiple-cucumber-html-reporter");
require("dotenv").config();
const path = require("path");

const cucumberJsonFile = "reports/cucumber-report.json";
const outputDir = "src/reports/cucumber";

function generateHtmlReport() {
  try {
    reporter.generate({
      jsonDir: "reports",            
      reportPath: outputDir,         
      metadata: {
        browser: {
          name: process.env.BROWSER || "chromium",
        },
        device: "Local Machine",
        platform: {
          name: process.platform,
        },
      },
      customData: {
        title: "Execution Info",
        data: [
          { label: "URL", value: process.env.URL },
          { label: "Tags", value: process.env.TAGS },
          { label: "Browser", value: process.env.BROWSER },
          { label: "Headless", value: process.env.HEADLESS },
          { label: "Parallel Workers", value: process.env.PARALLEL },
          { label: "Retries", value: process.env.RETRIES },
          { label: "Execution Time", value: new Date().toLocaleString() },
        ],
      },
    });

    console.log("✅ Cucumber HTML Report generated successfully!");
  } catch (err) {
    console.error("❌ Failed to generate Cucumber HTML report:", err);
    process.exit(1);
  }
}

generateHtmlReport();
