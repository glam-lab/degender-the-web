/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, testURL */

describe("When the user has disabled the extension on this page, the page", function() {
    let page;
    // TODO Add popup message tests
    //let popup;
    let originalContent;

    before(async function() {
        page = await browser.newPage();
        await page.goto(testURL);

        originalContent = await page.$eval("body", e => e.innerText);
    });

    after(async function() {
        await page.close();
        //await popup.close();
    });

    it.only("should not change the text", async function() {
        const content = await page.$eval("body", e => e.innerText);
        expect(content).to.equal(originalContent);
    });

    it("should explain in the popup");

    it("should not show the 'Show changes' checkbox");

    it("should not show the 'Show highlights' checkbox");

    it("should not show the 'Restore original content' button");

    it("should not show the 'Reload page' button");
});
