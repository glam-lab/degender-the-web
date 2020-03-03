/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, testURL, testHost, optionsURL, setDenyList */

describe("When the user has disabled the extension on this host, the page", function() {
    this.timeout(6000);
    let options;
    let page;
    let originalContent;
    const text = "She washed her motorcycle. He washed his car.";

    before(async function() {
        this.timeout(10000);
        options = await browser.newPage();
        await options.goto(optionsURL);
        await setDenyList(options, testHost);

        page = await browser.newPage();
        await page.goto(testURL + text);

        originalContent = await page.$eval("body", e => e.innerText);
    });

    after(async function() {
        await page.close();
        await setDenyList(options, "");
        await options.close();
    });

    it("should not change the text", async function() {
        const content = await page.$eval("body", e => e.innerText);
        expect(content).to.equal(originalContent);
    });

    // The content script isn't running, so the popup will need to check
    // whether the extension has been denied access to this host to explain why
    // this page won't respond to it.
    it("should explain in the popup");

    it("should not show the 'Show changes' checkbox");

    it("should not show the 'Show highlights' checkbox");

    it("should not show the 'Restore original content' button");

    it("should not show the 'Reload page' button");
});
