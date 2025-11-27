require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const cucumberJsonPath = path.resolve("reports/cucumber-report.json");
const allureResultsDir = path.resolve("src/reports/allure-results");

// create folders
if (!fs.existsSync(allureResultsDir)) fs.mkdirSync(allureResultsDir, { recursive: true });

// helper: safe read
function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf8");
  if (!content) return null;
  try { return JSON.parse(content); } catch (e) { return null; }
}

// read cucumber report
const cucumberReport = safeReadJson(cucumberJsonPath);
if (!cucumberReport) {
  console.warn("⚠️ cucumber-report.json not found or invalid. No conversion performed.");
  process.exit(0);
}

// ensure environment.properties
const envPropsPath = path.join(allureResultsDir, "environment.properties");
const envProps = [
  `Browser = ${process.env.BROWSER || ""}`,
  `Headless = ${process.env.HEADLESS || ""}`,
  `URL = ${process.env.URL || ""}`,
  `Environment = ${process.env.ENV || "Test"}`,
  `Platform = ${process.platform}`,
  `Retries=${process.env.RETRIES}`,
  `Parallel=${process.env.PARALLEL}`,
].join("\n");
fs.writeFileSync(envPropsPath, envProps);

// categories - keep user-defined categories.json if exists at project root under src/reports/allure-results/categories.json
// (If you want to override or create default categories, ensure file exists)
const defaultCategories = [
  {
    name: "Assertion Failures",
    matchedStatuses: ["failed"],
    messageRegex: "Assertion|assert"
  },
  {
    name: "Timeout Errors",
    matchedStatuses: ["failed"],
    messageRegex: "Timeout|timed out"
  },
  {
    name: "Network Errors",
    matchedStatuses: ["failed"],
    messageRegex: "net::ERR"
  }
];
const categoriesPath = path.join(allureResultsDir, "categories.json");
if (!fs.existsSync(categoriesPath)) {
  fs.writeFileSync(categoriesPath, JSON.stringify(defaultCategories, null, 2));
}

// helper to write attachment buffer and return file name
function writeAttachment(base64OrBuffer, mimeType, suggestedName) {
  const uid = uuidv4();
  const ext = (mimeType && mimeType.split("/")[1]) ? mimeType.split("/")[1].split(";")[0] : "";
  const filename = `${uid}${suggestedName ? "-" + suggestedName : ""}${ext ? "."+ext : ".bin"}`;
  const filePath = path.join(allureResultsDir, filename);
  let buffer;
  if (Buffer.isBuffer(base64OrBuffer)) buffer = base64OrBuffer;
  else {
    // data may be base64 string or raw text
    // try base64 decode, fallback to utf8
    try {
      buffer = Buffer.from(base64OrBuffer, 'base64');
      // quick heuristic: if buffer toString yields weird chars, fallback
      if (buffer.toString('base64').length === 0) throw new Error();
    } catch (e) {
      buffer = Buffer.from(String(base64OrBuffer), 'utf8');
    }
  }
  fs.writeFileSync(filePath, buffer);
  return filename;
}

// Main conversion
cucumberReport.forEach(feature => {
  const featureName = feature.name || "Feature";
  const featureId = feature.id || uuidv4();

  (feature.elements || []).forEach(scenario => {
    const scenarioId = scenario.id || uuidv4();
    const uuid = uuidv4();

    // compute step durations (cucumber durations are in nanoseconds)
    const stepDurations = (scenario.steps || []).map(s => (s.result && s.result.duration) ? Number(s.result.duration) : 0);
    const totalDurationNanos = stepDurations.reduce((a,b) => a + b, 0);
    const totalDurationMs = Math.round(totalDurationNanos / 1e6);

    const stop = Date.now();
    const start = stop - totalDurationMs;

    // status
    const hasFailed = (scenario.steps || []).some(s => (s.result && s.result.status === "failed") || s.result?.error_message);
    const allPassed = (scenario.steps || []).every(s => (s.result && s.result.status === "passed"));
    const status = allPassed ? "passed" : hasFailed ? "failed" : "skipped";

    // find failed step and message
    const failedStep = (scenario.steps || []).find(s => (s.result && s.result.status === "failed") || s.result?.error_message);
    const statusDetails = failedStep && failedStep.result && failedStep.result.error_message ? {
      message: String(failedStep.result.error_message).split("\n")[0],
      trace: String(failedStep.result.error_message)
    } : {};

    // compose labels
    const labels = [
      { name: "suite", value: featureName },
      { name: "feature", value: featureName },
      { name: "story", value: scenario.name || "" },

      // custom
      { name: "Browser", value: process.env.BROWSER || "chromium" },
      { name: "Environment", value: process.env.ENV || "local" },
      { name: "Platform", value: process.platform },
      { name: "Retries", value: process.env.RETRIES },
      { name: "Parallel", value: process.env.PARALLEL },
    ];

    // add tags from scenario if present
    if (Array.isArray(scenario.tags)) {
      scenario.tags.forEach(t => {
        const tagValue = (t.name || "").replace(/^@/, "");
        if (tagValue) labels.push({ name: "tag", value: tagValue });
      });
    }

    // build steps with accurate start/stop
    let accumulatedNanos = 0;
    const steps = (scenario.steps || []).map((step, index) => {
      const durationNanos = stepDurations[index] || 0;
      const stepStart = start + Math.round(accumulatedNanos / 1e6);
      accumulatedNanos += durationNanos;
      const stepStop = start + Math.round(accumulatedNanos / 1e6);

      // attachments for this step from Cucumber embeddings
      const stepAttachments = [];
      if (Array.isArray(step.embeddings)) {
        step.embeddings.forEach((emb, i) => {
          // emb: { mime_type, data (base64), name? }
          try {
            const filename = writeAttachment(emb.data, emb.mime_type || "application/octet-stream", `step-${index+1}`);
            stepAttachments.push({
              name: emb.name || `Attachment ${i+1}`,
              type: emb.mime_type || "application/octet-stream",
              source: filename
            });
          } catch (e) {
            // ignore
          }
        });
      }

      return {
        name: `${(step.keyword || "").trim()} ${step.name || ""}`.trim(),
        status: (step.result && step.result.status) ? step.result.status : "skipped",
        stage: "finished",
        start: Math.floor(stepStart),
        stop: Math.floor(stepStop),
        attachments: stepAttachments
      };
    });

    // collect scenario-level attachments (embedding at scenario-level — Cucumber may include)
    const scenarioAttachments = [];
    // If scenario has embeddings at scenario level (rare), handle here:
    if (Array.isArray(scenario.embeddings)) {
      scenario.embeddings.forEach((emb, i) => {
        try {
          const filename = writeAttachment(emb.data, emb.mime_type || "application/octet-stream", `sc-${i+1}`);
          scenarioAttachments.push({
            name: emb.name || `Scenario Attachment ${i+1}`,
            type: emb.mime_type || "application/octet-stream",
            source: filename
          });
        } catch (e) {}
      });
    }

    // Build final Allure result object
    const allureResult = {
      uuid: uuid,
      historyId: scenarioId,
      fullName: `${featureName}: ${scenario.name || ""}`,
      labels: labels,
      links: [],
      name: scenario.name || "",
      status: status,
      statusDetails: statusDetails,
      stage: "finished",
      steps: steps,
      attachments: scenarioAttachments,
      start: Math.floor(start),
      stop: Math.floor(stop)
    };

    // write file
    const outPath = path.join(allureResultsDir, `${uuid}-result.json`);
    fs.writeFileSync(outPath, JSON.stringify(allureResult, null, 2));
    console.log(`Converted scenario -> ${outPath}`);
  });
});

console.log("✅ Conversion finished.");
