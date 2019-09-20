/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, testURL, selectors */

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
        const contents = await page.$eval(selectors.content, e => e.innerText);
        expect(contents).to.equal(text);
    });

    it("should not have any highlights", async function() {
        expect(page.$$(selectors.highlight)).to.be.empty;
    });

    it("should not have any insertions or deletions", async function() {
        expect(page.$$(selectors.ins)).to.be.empty;
        expect(page.$$(selectors.del)).to.be.empty;
    });

    it.skip("should explain in the header", async function() {
        const headerText = await page.$eval(selectors.header, e => e.innerText);
        expect(headerText).to.include("no gender pronouns");
    });

    it("should not have a 'Show changes/highlights' button", async function() {
        expect(await page.$$(selectors.toggle)).to.be.empty;
    });
});
