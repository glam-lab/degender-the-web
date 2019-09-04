/*globals before, after, browser */
const puppeteer = require("puppeteer");
const { expect } = require("chai");
const _ = require("lodash");
const globalVariables = _.pick(global, [
    "browser",
    "expect",
    "testURL",
    "textdivSelector",
    "headerSelector",
    "highlightSelector",
    "replacementSelector"
]);

// puppeteer options
const opts = {
    headless: true
};

// expose variables
before(function(done) {
    global.expect = expect;
    global.testURL = "http://localhost:8080/test/html/e2e-helper.html?text=";
    global.textdivSelector = "#text";
    global.headerSelector = "#dgtw-header";
    global.highlightSelector = "span.dgtw-highlight";
    global.replacementSelector = "span.dgtw-replacement";

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
});
