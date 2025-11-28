require("dotenv").config();
const nodemailer = require("nodemailer");
const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));
const fs = require("fs");
const path = require("path");

// =============================================
// 📊 Load Summary from Cucumber JSON
// =============================================
function getSummary() {
  try {
    const json = JSON.parse(
      fs.readFileSync("src/reports/cucumber-report.json", "utf8")
    );

    let passed = 0, failed = 0, skipped = 0;
    json.forEach(feature => {
      feature.elements?.forEach(scenario => {
        const s =
          scenario.steps.every(s => s.result.status === "passed")
            ? "passed"
            : scenario.steps.some(s => s.result.status === "failed")
            ? "failed"
            : "skipped";

        if (s === "passed") passed++;
        else if (s === "failed") failed++;
        else skipped++;
      });
    });

    return { passed, failed, skipped, total: passed + failed + skipped };
  } catch {
    return { passed: 0, failed: 0, skipped: 0, total: 0 };
  }
}

const summary = getSummary();

// =============================================
// 🌐 URLs from GitHub Workflow
// =============================================
const ALLURE_URL = process.env.ALLURE_URL || "Not Available";
const CUCUMBER_URL = process.env.CUCUMBER_URL || "Not Available";

// =============================================
// 📧 EMAIL NOTIFICATION
// =============================================
async function sendEmail() {
  if (process.env.NOTIFY_EMAIL !== "true") return;

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const html = `
  <h2>🚀 <span style="color:#0078D4">Tychons USA - Automation Test Report</span></h2>

  <h3>🌍 Test Configuration</h3>
  <ul>
    <li><b>🔗 URL:</b> ${process.env.URL}</li>
    <li><b>🌐 Browser:</b> ${process.env.BROWSER}</li>
    <li><b>🏷 Tags:</b> ${process.env.TAGS}</li>
    <li><b>👻 Headless:</b> ${process.env.HEADLESS}</li>
    <li><b>🧵 Parallel:</b> ${process.env.PARALLEL}</li>
    <li><b>🔁 Retries:</b> ${process.env.RETRIES}</li>
  </ul>

  <h3>📊 Test Summary</h3>
  <ul>
    <li>✔ Passed: <b>${summary.passed}</b></li>
    <li>❌ Failed: <b>${summary.failed}</b></li>
    <li>⚠ Skipped: <b>${summary.skipped}</b></li>
    <li>📘 Total: <b>${summary.total}</b></li>
  </ul>

  <h3>📄 Reports</h3>
  <p><a href="${ALLURE_URL}">📁 Download Allure Report</a></p>
  <p><a href="${CUCUMBER_URL}">📘 Download Cucumber HTML Report</a></p>
  `;

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: process.env.MAIL_TO,
    subject: "🚀 Tychons USA – Automation Test Results",
    html
  });

  console.log("📧 Email sent successfully");
}

// =============================================
// 💬 SLACK NOTIFICATION
// =============================================
async function sendSlack() {
  if (process.env.NOTIFY_SLACK !== "true") return;

  const message = {
    text: `
🚀 *Tychons USA - Automation Test Results*

🌍 *URL:* ${process.env.URL}
🌐 *Browser:* ${process.env.BROWSER}
🏷 *Tags:* ${process.env.TAGS}

✔ Passed: *${summary.passed}*
❌ Failed: *${summary.failed}*
⚠ Skipped: *${summary.skipped}*
📊 Total: *${summary.total}*

📁 *Allure Report:* ${ALLURE_URL}
📘 *Cucumber HTML:* ${CUCUMBER_URL}
`
  };

  await fetch(process.env.SLACK_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message)
  });

  console.log("💬 Slack message sent");
}

// =============================================
// 👥 TEAMS NOTIFICATION
// =============================================
async function sendTeams() {
  if (process.env.NOTIFY_TEAMS !== "true") return;

  const card = {
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    summary: "Automation Test Results",
    themeColor: "0078D4",
    sections: [
      {
        activityTitle: "🚀 Tychons USA - Automation Test Results",
        facts: [
          { name: "🌍 URL", value: process.env.URL },
          { name: "🌐 Browser", value: process.env.BROWSER },
          { name: "🏷 Tags", value: process.env.TAGS },
          { name: "✔ Passed", value: summary.passed },
          { name: "❌ Failed", value: summary.failed },
          { name: "⚠ Skipped", value: summary.skipped },
          { name:"📊 Total: ", value:summary.total}
        ]
      },
      {
        text: `
📁 [Download Allure Report](${ALLURE_URL})  
📘 [Download Cucumber HTML Report](${CUCUMBER_URL})
`
      }
    ]
  };

  await fetch(process.env.TEAMS_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(card)
  });

  console.log("👥 Teams message sent");
}

// =============================================
// RUN ALL
// =============================================
(async () => {
  await sendEmail();
  await sendSlack();
  await sendTeams();
})();
