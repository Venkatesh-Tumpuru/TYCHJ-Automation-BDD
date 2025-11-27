# 🚀 Playwright + Cucumber BDD Automation Framework  

![Node](https://img.shields.io/badge/NodeJS-%3E%3D16-green)  
![Playwright](https://img.shields.io/badge/Playwright-Automation-blueviolet)  
![Cucumber](https://img.shields.io/badge/Cucumber-BDD-brightgreen)  
![Allure](https://img.shields.io/badge/Allure-Reporting-orange)  
![License](https://img.shields.io/badge/License-MIT-blue)  
![Status](https://img.shields.io/badge/Build-Passing-success)  

### ⚡ Allure Reporting • Parallel Execution • Tag Filters • Notifications • GitHub CI/CD  

This is a complete enterprise-level UI Automation Testing Framework built using Playwright, Cucumber BDD, JavaScript/TypeScript, Allure Reporting, Parallel Execution, Tag Filters, Environment-based execution, and GitHub CI/CD. Designed so that future teams never struggle.  

## ⚙️ Environment Configuration (.env)  

Everything runs from `.env`:  

BROWSER=chromium  
HEADLESS=false  
URL=https://parabank.parasoft.com/parabank/index.htm  
TAGS=@smoke  
MAXTIME=30000  
SIMPLETIME=5000  
MINTIME=1000  
PARALLEL=1  
RETRIES=0  
CUCUMBER_PUBLISH_ENABLED=false  
NOTIFY_EMAIL=false  
NOTIFY_SLACK=false  
NOTIFY_TEAMS=false  
MAIL_HOST=smtp.gmail.com  
MAIL_PORT=587  
MAIL_USER=your-email@gmail.com  
MAIL_PASS=xxxx  
MAIL_TO=team@gmail.com  
SLACK_WEBHOOK=https://hooks.slack.com/services/xxxx  
TEAMS_WEBHOOK=https://outlook.office.com/webhook/xxxx  

## 📦 Install Dependencies  

npm install  
npx playwright install  

## 🧪 Run Tests  

Run all tests:  
npm run test  

Run tagged tests:  
TAGS=@smoke npm run test  

Headless/Browser/Parallel/Retry are controlled via `.env`.  

## 🧵 Parallel Execution  

Enabled via `.env`:  
PARALLEL=3  

Framework auto-applies:  
--parallel 3  

## 🔁 Retries  

Set in `.env`:  
RETRIES=2  

## 📸 Screenshots, Videos & Logs  

Framework automatically captures and attaches:  
✔ Failure screenshots  
✔ Video recordings  
✔ Browser console logs  
✔ Page errors  
✔ HTML dumps  
✔ Network traces  

All displayed in the Allure Report.  

## 📊 Allure Reporting  

Generate report:  
npm run allure:generate  

Open report:  
npm run allure:open  

Full cycle (clean + test + convert + report + open):  
npm run test:allure  

## 🌟 Allure Enhancements  

Framework contains a custom-built converter which provides:  
✔ Step timeline  
✔ Console logs  
✔ Video attachment  
✔ Screenshot attachment  
✔ Tags in Allure  
✔ Browser label  
✔ Environment label  
✔ Platform label  
✔ Allure categories  
✔ environment.properties  
✔ Rich step details  

## 📬 Notifications  

Enable in `.env`:  
NOTIFY_EMAIL=true  
NOTIFY_SLACK=true  
NOTIFY_TEAMS=true  

Supports:  
✔ Email (SMTP/Gmail)  
✔ Slack (Webhook)  
✔ Microsoft Teams (Webhook)  

Notification includes:  
✔ Total tests  
✔ Passed count  
✔ Failed count  
✔ Failed scenario names  
✔ Allure Report path  

## ☁️ GitHub Actions CI/CD  

Supports:  
✔ Tag input  
✔ Browser selection  
✔ Headless toggle  
✔ Parallel count  
✔ Retry count  
✔ Allure artifact upload  
✔ Notifications  

## 🧑‍💻 Developer Quick Start  

git clone <repo>  
cd Automation_BDD  
npm install  
npx playwright install  
create .env  
npm run test  
npm run test:allure  

## 🛠️ Troubleshooting  

Allure report empty → Check allure-results folder.  
.env values missing → Ensure converter includes require("dotenv").config().  
Playwright browsers missing → npx playwright install  
Git push failure → Use GitHub Personal Access Token.  

## 🔮 Future Enhancements  

✔ Docker execution  
✔ Allure Server deployment  
✔ Dashboard analytics  
✔ API + UI hybrid automation  

## 🤝 Contribution Rules  

✔ Use Page Object Model  
✔ Keep selectors in /locators  
✔ Keep step definitions simple  
✔ Write meaningful commit messages  
✔ Never push .env or report folders  

## 🎉 Conclusion  

This automation framework is scalable, maintainable, CI/CD-ready, and extremely powerful with custom Allure reporting. Designed for long-term enterprise use.  

Happy Testing! 🚀
