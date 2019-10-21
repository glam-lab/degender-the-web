/* globals describe, before, after, it, expect, browser, testURL, popupURL, selectors */

describe("When the user clicks on the restore button, it", function() {
    let popup;
    let page;
    const text = "She put on her boots.";

    before(async function() {
        page = await browser.newPage();
        await page.goto(testURL + text);

        popup = await browser.newPage();
        await popup.goto(popupURL);

        await popup.click(selectors.restore);
    });

    after(async function() {
        await page.close();
        await popup.close();
    });

    it("should restore the original page content", async function() {
        const contents = await page.$eval(selectors.content, e => e.innerText);
        expect(contents).to.equal(text);
    });

    it("should explain in the popup", async function() {
        const statusText = await popup.$eval(
            selectors.status,
            e => e.innerText
        );
        expect(statusText).to.equal("The original content has been restored.");
    });

    it("should not show the 'Show changes' checkbox", async function() {
        await page.waitForSelector(selectors.showChanges, { hidden: true });
    });

    it("should not show the 'Show highlights' checkbox", async function() {
        await page.waitForSelector(selectors.showHighlights, { hidden: true });
    });

    it("should not show the 'Restore' button", async function() {
        await page.waitForSelector(selectors.restoreOriginalContent, {
            hidden: true
        });
    });
});
