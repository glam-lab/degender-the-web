/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, testURL, textdivSelector, replacementSelector, highlightSelector, headerSelector */

describe("When the page includes gender pronouns, it", function() {
    let page;
    const text = "She washed her motorcycle. He washed his car.";

    before(async function() {
        page = await browser.newPage();
        await page.goto(testURL + text);
    });

    after(async function() {
        await page.close();
    });

    it("should not include any highlight text", async function() {
        const highlights = await page.$$(highlightSelector);
        expect(highlights).to.be.empty;
    });

    it("should replace personal pronouns", async function() {
        const contents = await page.$eval(textdivSelector, e => e.innerText);
        expect(contents).to.equal(
            "They washed their motorcycle. They washed their car."
        );
    });

    it("should mark up replacement text", async function() {
        const replacements = await page.$$(replacementSelector);
        expect(replacements.length).to.equal(4);
    });

    it("should explain in the header", async function() {
        const headerText = await page.$eval(headerSelector, e => e.innerText);
        expect(headerText).to.include("replaced gender pronouns");
    });
});
