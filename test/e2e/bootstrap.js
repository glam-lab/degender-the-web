/*globals before, after, browser */
const puppeteer = require("puppeteer");
const { expect } = require("chai");
const _ = require("lodash");
const globalVariables = _.pick(global, [
    "browser",
    "expect",
    "testURL",
    "unsupportedURL",
    "popupURL",
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
    global.expect = expect;
    global.testURL = "http://localhost:8080/test/e2e/helper.html?text=";
    global.unsupportedURL = "https://www.facebook.com";
    global.popupURL =
        "chrome-extension://kgeehecadkggegiegoamiabpdjpgjkhg/src/popup.html?test=true";
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
        highlight: "strong.dgtw"
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
    global.popupURL = globalVariables.popupURL;
    global.selectors = globalVariables.selectors;
});
