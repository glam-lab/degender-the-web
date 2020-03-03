/*globals before, after, browser */
const puppeteer = require("puppeteer");
const { expect } = require("chai");
const _ = require("lodash");
const globalVariables = _.pick(global, [
    "browser",
    "expect",
    "testURL",
    "unsupportedURL",
    "testHost",
    "popupURL",
    "optionsURL",
    "selectors"
]);

const extensionPath = "."; // Path of directory with manifest.json

// puppeteer options
const opts = {
    headless: false,
    args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`
    ]
};

// expose variables
before(function(done) {
    this.timeout(4000); // Chromium can take more than 3 seconds to start
    global.expect = expect;
    global.testURL = "http://localhost:8080/test/e2e/helper.html?text=";
    global.unsupportedURL = "https://www.facebook.com";

    // This page should load quickly, and it's more normal than localhost.
    global.testHost = "localhost:8080";

    global.popupURL =
        "chrome-extension://kgeehecadkggegiegoamiabpdjpgjkhg/src/popup.html?test=true";
    global.optionsURL =
        "chrome-extension://kgeehecadkggegiegoamiabpdjpgjkhg/src/options.html";
    global.selectors = {
        content: "#text",
        status: "#status",
        restore: "#restore",
        reloadPage: "#reload-page",
        showChanges: "#show-changes",
        showChangesCheckbox: "#show-changes-checkbox",
        showHighlights: "#show-highlights",
        showHighlightsCheckbox: "#show-highlights-checkbox",
        ins: "ins.dgtw",
        del: "del.dgtw",
        highlight: "strong.dgtw",
        denyList: "#denyList",
        saveDenyList: "#save"
    };

    puppeteer.launch(opts).then(function(browser) {
        global.browser = browser;
        done();
    });
});

// close browser and reset global variables
after(function() {
    browser.close();

    global.browser = globalVariables.browser;
    global.expect = globalVariables.expect;
    global.testURL = globalVariables.testURL;
    global.unsupportedURL = globalVariables.unsupportedURL;
    global.testHost = globalVariables.testHost;
    global.popupURL = globalVariables.popupURL;
    global.optionsURL = globalVariables.optionsURL;
    global.selectors = globalVariables.selectors;
});
