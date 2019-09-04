/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, testURL, replacementSelector, highlightSelector, headerSelector */

describe("When the page includes personal pronoun specifiers, it", function() {
    let page;
    const text =
        "This page discusses personal pronoun specifiers, " +
        "such as he/him, she/her, and they/them.";
    const personalPronounSpecs = ["he/him", "she/her", "they/them"];

    before(async function() {
        page = await browser.newPage();
        await page.goto(testURL + text);
    });

    after(async function() {
        await page.close();
    });

    it("should still say 'he/him', 'she/her', and 'they/them'", async function() {
        const bodyText = await page.$eval("body", e => e.innerText);
        personalPronounSpecs.forEach(function(p) {
            expect(bodyText).to.include(p);
        });
    });

    it("should not include any replacement text", async function() {
        const replacements = page.$$(replacementSelector);
        expect(replacements).to.be.empty;
    });

    it("should highlight personal pronoun specifiers", async function() {
        const highlightTexts = await page.$$eval(highlightSelector, es =>
            es.map(e => e.innerText)
        );
        personalPronounSpecs.forEach(function(p) {
            expect(highlightTexts).to.include(p);
        });
    });

    it("should explain in the header", async function() {
        const headerText = await page.$eval(headerSelector, e => e.innerText);
        expect(headerText).to.include("personal pronoun");
    });
});
