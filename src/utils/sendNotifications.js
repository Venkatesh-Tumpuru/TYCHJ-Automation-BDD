require("dotenv").config();
const nodemailer = require("nodemailer");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

// Get test results from cucumber report
function getTestResults() {
  try {
    const reportPath = path.resolve(process.cwd(), "src/reports/cucumber-report.json");
    const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));

    let total = 0;
    let passed = 0;
    let failed = 0;
    let skipped = 0;
    let totalDuration = 0;

    report.forEach((feature) => {
      feature.elements.forEach((scenario) => {
        total++;
        const scenarioStatus = scenario.steps.every((step) => step.result?.status === "passed")
          ? "passed"
          : scenario.steps.some((step) => step.result?.status === "failed")
          ? "failed"
          : "skipped";

        if (scenarioStatus === "passed") passed++;
        else if (scenarioStatus === "failed") failed++;
        else skipped++;

        scenario.steps.forEach((step) => {
          totalDuration += step.result?.duration || 0;
        });
      });
    });

    const durationSeconds = (totalDuration / 1000000000).toFixed(2);
    return { total, passed, failed, skipped, duration: `${durationSeconds}s` };
  } catch (error) {
    console.error("❌ Error reading test results:", error);
    return { total: 0, passed: 0, failed: 0, skipped: 0, duration: "0s" };
  }
}

// Send Email Notification
async function sendEmailNotification() {
  if (process.env.NOTIFY_EMAIL !== "true") {
    console.log("📧 Email notification is disabled");
    return;
  }

  const results = getTestResults();
  const status = results.failed > 0 ? "FAILED ❌" : "PASSED ✅";
  const mailTo = process.env.MAIL_TO?.split(",").map((email) => email.trim()) || [];

  // Build artifact download section if in GitHub Actions
  let artifactDownloadSection = "";
  if (process.env.GITHUB_SERVER_URL && process.env.GITHUB_RUN_ID) {
    const artifactUrl = `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;
    artifactDownloadSection = `
      <div style="text-align: center; margin-top: 30px;">
        <a href="${artifactUrl}" style="display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
          📥 Download Allure Report
        </a>
        <p style="margin-top: 10px; color: #6b7280; font-size: 14px;">Click to view and download the complete test report</p>
      </div>
    `;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
        .header h1 { margin: 0 0 10px 0; font-size: 28px; }
        .header p { margin: 0; font-size: 14px; opacity: 0.9; }
        .status { font-size: 24px; font-weight: bold; margin: 20px 0; text-align: center; }
        .status.passed { color: #10b981; }
        .status.failed { color: #ef4444; }
        .stats { display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap; }
        .stat-box { text-align: center; padding: 15px; background: #f9fafb; border-radius: 8px; flex: 1; margin: 5px; min-width: 100px; }
        .stat-number { font-size: 32px; font-weight: bold; margin-bottom: 5px; }
        .stat-label { font-size: 14px; color: #6b7280; text-transform: uppercase; }
        .info-section { text-align: center; padding: 20px; background: #f9fafb; border-radius: 8px; margin-top: 20px; }
        .info-section p { margin: 10px 0 0 0; color: #6b7280; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 12px; }
        .footer p { margin: 5px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🧪 Test Execution Report</h1>
          <p>Automation Test Results - Playwright + Cucumber + BDD</p>
        </div>
        
        <div class="status ${results.failed > 0 ? "failed" : "passed"}">
          Test Status: ${status}
        </div>
        
        <div class="stats">
          <div class="stat-box">
            <div class="stat-number">${results.total}</div>
            <div class="stat-label">Total</div>
          </div>
          <div class="stat-box" style="background: #d1fae5;">
            <div class="stat-number" style="color: #10b981;">${results.passed}</div>
            <div class="stat-label">Passed</div>
          </div>
          <div class="stat-box" style="background: #fee2e2;">
            <div class="stat-number" style="color: #ef4444;">${results.failed}</div>
            <div class="stat-label">Failed</div>
          </div>
          <div class="stat-box" style="background: #fef3c7;">
            <div class="stat-number" style="color: #f59e0b;">${results.skipped}</div>
            <div class="stat-label">Skipped</div>
          </div>
        </div>
        
        <div class="info-section">
          <p style="margin: 0;">⏱️ Duration: <strong>${results.duration}</strong></p>
          <p>🌐 Browser: <strong>${process.env.BROWSER || "chromium"}</strong></p>
          <p>🏷️ Tags: <strong>${process.env.TAGS || "all"}</strong></p>
        </div>
        
        ${artifactDownloadSection}
        
        <div class="footer">
          <p>This is an automated message from your CI/CD pipeline</p>
          <p>Timestamp: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Automation Tests" <${process.env.MAIL_USER}>`,
      to: mailTo.join(", "),
      subject: `Test Execution ${status} - ${new Date().toLocaleDateString()}`,
      html: htmlContent,
    });
    console.log("✅ Email notification sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}

// Send Slack Notification
async function sendSlackNotification() {
  if (process.env.NOTIFY_SLACK !== "true") {
    console.log("💬 Slack notification is disabled");
    return;
  }

  const results = getTestResults();
  const status = results.failed > 0 ? "FAILED" : "PASSED";
  const color = results.failed > 0 ? "#ef4444" : "#10b981";
  const emoji = results.failed > 0 ? "❌" : "✅";

  const slackMessage = {
    attachments: [
      {
        color: color,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: `${emoji} Test Execution ${status}`,
              emoji: true,
            },
          },
          {
            type: "section",
            fields: [
              { type: "mrkdwn", text: `*Total:*\n${results.total}` },
              { type: "mrkdwn", text: `*Passed:*\n✅ ${results.passed}` },
              { type: "mrkdwn", text: `*Failed:*\n❌ ${results.failed}` },
              { type: "mrkdwn", text: `*Skipped:*\n⚠️ ${results.skipped}` },
            ],
          },
          {
            type: "section",
            fields: [
              { type: "mrkdwn", text: `*Duration:*\n⏱️ ${results.duration}` },
              { type: "mrkdwn", text: `*Browser:*\n🌐 ${process.env.BROWSER || "chromium"}` },
              { type: "mrkdwn", text: `*Tags:*\n🏷️ ${process.env.TAGS || "all"}` },
              { type: "mrkdwn", text: `*Timestamp:*\n🕐 ${new Date().toLocaleString()}` },
            ],
          },
        ],
      },
    ],
  };

  // Add download button if in GitHub Actions
  if (process.env.GITHUB_SERVER_URL && process.env.GITHUB_RUN_ID) {
    slackMessage.attachments[0].blocks.push({
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "📥 Download Report", emoji: true },
          url: `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,
          style: "primary",
        },
      ],
    });
  }

  try {
    const response = await fetch(process.env.SLACK_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slackMessage),
    });

    if (response.ok) {
      console.log("✅ Slack notification sent successfully!");
    } else {
      console.error("❌ Error sending Slack notification:", await response.text());
    }
  } catch (error) {
    console.error("❌ Error sending Slack notification:", error);
  }
}

// Send Teams Notification
async function sendTeamsNotification() {
  if (process.env.NOTIFY_TEAMS !== "true") {
    console.log("👥 Teams notification is disabled");
    return;
  }

  const results = getTestResults();
  const status = results.failed > 0 ? "FAILED" : "PASSED";
  const emoji = results.failed > 0 ? "❌" : "✅";

  const teamsMessage = {
    "@type": "MessageCard",
    "@context": "https://schema.org/extensions",
    summary: `Test Execution ${status}`,
    themeColor: results.failed > 0 ? "d63031" : "00b894",
    title: `${emoji} Test Execution ${status}`,
    sections: [
      {
        activityTitle: "Test Results Summary",
        activitySubtitle: new Date().toLocaleString(),
        facts: [
          { name: "Total Scenarios:", value: results.total.toString() },
          { name: "✅ Passed:", value: results.passed.toString() },
          { name: "❌ Failed:", value: results.failed.toString() },
          { name: "⚠️ Skipped:", value: results.skipped.toString() },
          { name: "⏱️ Duration:", value: results.duration },
          { name: "🌐 Browser:", value: process.env.BROWSER || "chromium" },
          { name: "🏷️ Tags:", value: process.env.TAGS || "all" },
        ],
      },
    ],
    potentialAction: [],
  };

  // Add download button if in GitHub Actions
  if (process.env.GITHUB_SERVER_URL && process.env.GITHUB_RUN_ID) {
    teamsMessage.potentialAction.push({
      "@type": "OpenUri",
      name: "📥 Download Report",
      targets: [
        {
          os: "default",
          uri: `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,
        },
      ],
    });
  }

  try {
    const response = await fetch(process.env.TEAMS_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teamsMessage),
    });

    if (response.ok) {
      console.log("✅ Teams notification sent successfully!");
    } else {
      console.error("❌ Error sending Teams notification:", await response.text());
    }
  } catch (error) {
    console.error("❌ Error sending Teams notification:", error);
  }
}

// Main function to send all notifications
async function sendAllNotifications() {
  console.log("\n📢 Sending notifications...\n");
  
  try {
    await Promise.all([
      sendEmailNotification(),
      sendSlackNotification(),
      sendTeamsNotification(),
    ]);
    console.log("\n✅ All notifications processed!\n");
  } catch (error) {
    console.error("\n❌ Error sending notifications:", error);
    process.exit(1);
  }
}

// Execute
sendAllNotifications();