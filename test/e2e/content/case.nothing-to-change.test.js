/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, testURL, 
          textdivSelector, headerSelector, toggleSelector,
          highlightSelector, insSelector, delSelector */

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

    it("should not have any highlights", async function() {
        expect(page.$$(highlightSelector)).to.be.empty;
    });

    it("should not have any insertions or deletions", async function() {
        expect(page.$$(insSelector)).to.be.empty;
        expect(page.$$(delSelector)).to.be.empty;
    });

    it("should explain in the header", async function() {
        const headerText = await page.$eval(headerSelector, e => e.innerText);
        expect(headerText).to.include("no gender pronouns");
    });

    it("should not have a 'Show changes/highlights' button", async function() {
        expect(await page.$$(toggleSelector)).to.be.empty;
    });
});
