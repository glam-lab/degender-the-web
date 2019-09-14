/*globals before, after, browser */
const puppeteer = require("puppeteer");
const { expect } = require("chai");
const _ = require("lodash");
const globalVariables = _.pick(global, [
    "browser",
    "expect",
    "testURL",
    "selectors"
]);

// puppeteer options
const opts = {
    headless: true
};

// expose variables
before(function(done) {
    global.expect = expect;
    global.testURL = "http://localhost:8080/test/e2e/helper.html?text=";
    global.selectors = {
        content: "#text",
        header: "#dgtw-header",
        toggle: "#dgtw-toggle",
        restore: "#dgtw-restore",
        dismiss: "#dgtw-dismiss",
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
    global.selectors = globalVariables.selectors;
});
