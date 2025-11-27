# 🚀 Playwright + Cucumber BDD Automation Framework  
### ✨ With Allure Reporting • Parallel Execution • Tag Filters • GitHub CI • Notifications

---

## 📌 Overview

This repository contains a **complete end-to-end automation testing framework** built using:

- **Playwright** (UI automation)
- **Cucumber BDD** (Feature files, Gherkin syntax)
- **TypeScript / JavaScript**
- **Custom Allure Reporting Integration**
- **Parallel execution**
- **Tag-based scenario selection**
- **Environment-based execution (.env)**
- **Email, Slack & Microsoft Teams Notifications**
- **GitHub Actions CI Pipeline Support**

The framework is fully modular, cleanly structured, and ideal for **enterprise-level automation**.

---

## 🏗️ Folder Structure

Automation_BDD/
│
├── src/
│ ├── features/ # Feature files (.feature)
│ ├── steps/ # Step definitions
│ ├── pages/ # Page Object Model files
│ ├── locators/ # Centralized element locators
│ ├── hooks/ # Test hooks (Before/After)
│ ├── utils/ # Helper classes (browser manager, cleaners)
│ ├── reporter/ # Custom Allure formatter + converters
│ └── reports/
│ ├── allure-results/ # Raw Allure JSON files
│ └── allure-report/ # Generated Allure HTML report
│
├── scripts/ # Allure converters / env writers / cleaners
├── cucumber.js # Cucumber runner config
├── package.json
├── tsconfig.json
└── .env # Environment configurations