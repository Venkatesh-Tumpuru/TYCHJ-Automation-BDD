# 🚀 Playwright + Cucumber BDD Automation Framework  
### ⚡ Allure Reporting • Parallel Execution • Tag Filters • Notifications • GitHub CI/CD
This is a complete enterprise-level UI Automation Testing Framework built using Playwright, Cucumber BDD, JavaScript/TypeScript, Allure Reporting, Parallel Execution, Tag Filters, Environment-based execution, and GitHub CI/CD. Designed so future teams never struggle.

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

## 🧵 Parallel Execution
Set in `.env`:
PARALLEL=3

## 🔁 Retries
Set in `.env`:
RETRIES=2

## 📸 Screenshots, Videos, Logs
Framework automatically captures and attaches:
- Failure screenshots  
- Video recordings  
- Console logs  
- Page errors  
- HTML dumps  
- Network traces  
All displayed inside Allure.

## 📊 Allure Reporting
Generate:
npm run allure:generate
Open:
npm run allure:open
Full flow:
npm run test:allure
This cleans old results, runs tests, converts cucumber JSON to Allure, writes environment.properties, generates HTML, opens report.

## 🌟 Allure Enhancements
Custom converter provides:
✔ Step timeline  
✔ Logs  
✔ Videos  
✔ Screenshots  
✔ Tags in Allure  
✔ Browser in Allure  
✔ Environment in Allure  
✔ Platform in Allure  
✔ Categories (Timeout, Assertion, Network)  
✔ Rich step details  
✔ environment.properties  

## 📬 Notifications
Enable in `.env`:
NOTIFY_EMAIL=true
NOTIFY_SLACK=true
NOTIFY_TEAMS=true
Supports:
Email (SMTP), Slack Webhook, Teams Webhook
Includes:
Total tests, Passed, Failed, Failed scenario names, Allure path.

## ☁️ GitHub Actions CI/CD
Supports:
Tag input  
Browser selection  
Headless toggle  
Parallel count  
Retry count  
Allure artifact upload  
Notifications  
Fully CI-friendly.

## 🧑‍💻 Developer Quick Start
git clone <repo>
cd Automation_BDD
npm install
npx playwright install
create .env
npm run test
npm run test:allure

## 🛠️ Troubleshooting
Allure report empty → check allure-results folder  
.env not showing in Allure → ensure converter has require("dotenv").config()  
Playwright browsers missing → npx playwright install  
Git push errors → use GitHub Personal Access Token  

## 🔮 Future Enhancements
Docker execution  
Allure server deployment  
Dashboard analytics  
API + UI hybrid  

## 🤝 Contribution Rules
Use POM  
Keep locators in /locators  
Readable step definitions  
Meaningful commit messages  
Never push .env or reports  

## 🎉 Conclusion
This framework is scalable, maintainable, CI-ready, highly powerful with Allure reporting, and designed for long-term enterprise usage. Happy Testing! 🚀
