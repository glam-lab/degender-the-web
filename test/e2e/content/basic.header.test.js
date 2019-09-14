/*globals describe, before, after, it, expect, browser, testURL, selectors */

describe("The header", function() {
    let page;

    before(async function() {
        page = await browser.newPage();
        await page.goto(testURL + "The page text doesn't matter.");
    });

    after(async function() {
        await page.close();
    });

    it("should be present", async function() {
        await page.waitFor(selectors.header);
    });

    it("should be singular", async function() {
        const headers = await page.$$(selectors.header);
        expect(headers.length).to.equal(1);
    });

    it("should be a child of the body", async function() {
        await page.$("body > " + selectors.header);
    });

    it("should be visible", async function() {
        await page.waitFor(selectors.header, { visible: true });
    });

    it("should say the name of the extension", async function() {
        const headerText = await page.$eval(
            selectors.header,
            header => header.innerText
        );
        expect(headerText).to.include("Degender the Web");
    });

    it("should contain a dismiss button", async function() {
        await page.$(selectors.header + " > #dismiss");
    });

    it("should contain a restore button", async function() {
        await page.$(selectors.header + " > #restore");
    });
});
