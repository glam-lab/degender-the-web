/* globals describe, before, after, it, expect, browser, testURL, selectors */

describe("When the user clicks on the restore button, it", function() {
    let popup;
    let page;
    const text = "She put on her boots.";

    before(async function() {
        popup = await browser.newPage();
        // TODO Make this not hardcoded
        await popup.goto(
            "chrome-extension://ficejgipfhgebnbdlabicfgkkndjpaoo/src/popup.html"
        );

        page = await browser.newPage();
        await page.goto(testURL + text);
    });

    after(async function() {
        await popup.close();
        await page.close();
    });

    it("should restore the original page content", async function() {
        const contents = await page.$eval(selectors.content, e => e.innerText);
        expect(contents).to.equal(text);
    });
});
