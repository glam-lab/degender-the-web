/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, testURL, popupURL, selectors */

describe("When the page includes personal pronoun specifiers, it", function() {
    let page;
    let popup;
    const text =
        "This page discusses personal pronoun specifiers, " +
        "such as he/him, she/her, and they/them.";
    const personalPronounSpecs = ["he/him", "she/her", "they/them"];

    before(async function() {
        page = await browser.newPage();
        await page.goto(testURL + text);

        popup = await browser.newPage();
        await popup.goto(popupURL);
    });

    after(async function() {
        await page.close();
        await popup.close();
    });

    it("should still say 'he/him', 'she/her', and 'they/them'", async function() {
        const bodyText = await page.$eval("body", e => e.innerText);
        personalPronounSpecs.forEach(function(p) {
            expect(bodyText).to.include(p);
        });
    });

    it("should not have any insertions or deletions", async function() {
        expect(await page.$$(selectors.ins)).to.be.empty;
        expect(await page.$$(selectors.del)).to.be.empty;
    });

    it("should highlight personal pronoun specifiers", async function() {
        const highlightTexts = await page.$$eval(selectors.highlight, es =>
            es.map(e => e.innerText)
        );
        personalPronounSpecs.forEach(function(p) {
            expect(highlightTexts).to.include(p);
        });
    });

    it("should not initially show those highlights", async function() {
        expect(await page.$$(selectors.highlight + ".show")).to.be.empty;
    });

    it("should explain in the popup", async function() {
        const headerText = await popup.$eval(
            selectors.status,
            e => e.innerText
        );
        expect(headerText).to.include("personal pronoun");
    });

    it("should have a 'Show highlights' button", async function() {
        const buttonText = await page.$eval(selectors.toggle, e => e.innerText);
        expect(buttonText).to.equal("Show highlights");
    });
});
