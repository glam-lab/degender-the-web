/* globals describe, before, after, it, expect, browser, testURL, popupURL, selectors */

describe("When the user clicks on the restore button, it", function() {
    let popup;
    let page;
    const text = "She put on her boots.";

    before(async function() {
        popup = await browser.newPage();
        await popup.goto(popupURL);

        page = await browser.newPage();
        await page.goto(testURL + text);
    });

    after(async function() {
        // For some reason, the popup is already closed.

        await page.close();
    });

    it("should restore the original page content", async function() {
        const contents = await page.$eval(selectors.content, e => e.innerText);
        expect(contents).to.equal(text);
    });
});
