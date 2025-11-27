const { CucumberJSAllureFormatter } = require("allure-cucumberjs");
const path = require("path");

class AllureReporter extends CucumberJSAllureFormatter {
  constructor(options) {
    super(options, {
      resultsDir: path.resolve(process.cwd(), "src/reports/allure-results")
    });
    console.log("📊 Allure Reporter initialized");
  }
}

module.exports = AllureReporter;
module.exports.default = AllureReporter;