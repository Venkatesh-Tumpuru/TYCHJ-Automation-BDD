require("dotenv").config();
const fs = require("fs");
const path = require("path");

const dir = path.resolve("src/reports/allure-results");
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const data = `
browser=${process.env.BROWSER}
headless=${process.env.HEADLESS}
url=${process.env.URL}
environment=${process.env.ENV || "local"}
platform=${process.platform}
retries=${process.env.RETRIES}
parallel=${process.env.PARALLEL}
`;

fs.writeFileSync(path.join(dir, "environment.properties"), data.trim());
console.log("✔ environment.properties written with ENV values");
