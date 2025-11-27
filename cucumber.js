require("dotenv").config();

const tags = process.env.TAGS || "";
const parallel = process.env.PARALLEL || "1";
const retries = process.env.RETRIES || "0";

// Color helpers
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const WHITE = "\x1b[37m";

const ICONS = {
  BROWSER: "🌐 ",
  URL: "🔗 ",
  HEADLESS: "👻 ",
  PARALLEL: "🧵",
  RETRIES: "🔁 ",
  TAGS: "🏷️ ",
  NOTIFY_EMAIL: "📧 ",
  NOTIFY_SLACK: "💬 ",
  NOTIFY_TEAMS: "👥 "
};

function logEnv(key, value) {
  const emoji = ICONS[key] || "🔹";
  console.log(`${emoji} ${YELLOW}${BOLD}${key}:${RESET} ${WHITE}${value}${RESET}`);
}

console.log(`\n${CYAN}${BOLD}========== 🌍 ENVIRONMENT VARIABLES ========== ${RESET}`);
logEnv("BROWSER", process.env.BROWSER);
logEnv("URL", process.env.URL);
logEnv("HEADLESS", process.env.HEADLESS);
logEnv("PARALLEL", process.env.PARALLEL);
logEnv("RETRIES", process.env.RETRIES);
logEnv("TAGS", process.env.TAGS);
logEnv("NOTIFY_EMAIL", process.env.NOTIFY_EMAIL);
logEnv("NOTIFY_SLACK", process.env.NOTIFY_SLACK);
logEnv("NOTIFY_TEAMS", process.env.NOTIFY_TEAMS);
console.log(`${CYAN}${BOLD}==============================================${RESET}\n`);

module.exports = {
  default: [
    // features
    "src/features/**/*.feature",
    // output cucumber json (used by converter)
    "--format json:reports/cucumber-report.json",
    // ts-node / steps / hooks
    "--require src/steps/**/*.ts",
    "--require src/hooks/**/*.ts",
    "--require-module ts-node/register",
    // keep terminal progress
    "--format progress",
    // tags / parallel / retry
    tags ? `--tags "${tags}"` : "",
    `--parallel ${parallel}`,
    `--retry ${retries}`,
    "--publish-quiet"
  ]
    .filter(Boolean)
    .join(" ")
};