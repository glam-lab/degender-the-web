/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, testURL, textdivSelector, replacementSelector, highlightSelector, headerSelector */

describe("When the page does not include any gender pronouns or stopwords, it", function() {
    let page;
    const text = "This page has no pronouns.";

    before(async function() {
        page = await browser.newPage();
        await page.goto(testURL + text);
    });

    after(async function() {
        await page.close();
    });

    it("should retain the given text", async function() {
        const contents = await page.$eval(textdivSelector, e => e.innerText);
        expect(contents).to.equal(text);
    });

    it("should not include any replacement text", async function() {
        const replacements = page.$$(replacementSelector);
        expect(replacements).to.be.empty;
    });

    it("should not include any highlights", async function() {
        const highlights = page.$$(highlightSelector);
        expect(highlights).to.be.empty;
    });

    it("should explain in the header", async function() {
        const headerText = await page.$eval(headerSelector, e => e.innerText);
        expect(headerText).to.include("no gender pronouns");
    });
});
