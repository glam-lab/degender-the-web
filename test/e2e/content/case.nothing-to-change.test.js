/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, testURL, popupURL, selectors */

describe("When the page does not include any gender pronouns or stopwords, it", function() {
    let page;
    let popup;
    const text = "This page has no pronouns.";

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

    it("should explain in the popup", async function() {
        const statusText = await popup.$eval(
            selectors.status,
            e => e.innerText
        );
        expect(statusText).to.include("no gender pronouns");
    });

    it("should hide the 'Show changes' checkbox", async function() {
        const checkbox = await popup.waitForSelector(
            selectors.showChangesCheckbox,
            { visible: false }
        );
        expect(checkbox).to.not.be.empty;
    });

    it("should hide the 'Show highlights' checkbox", async function() {
        const checkbox = await popup.waitForSelector(
            selectors.showHighlightsCheckbox,
            { visible: false }
        );
        expect(checkbox).to.not.be.empty;
    });
});
