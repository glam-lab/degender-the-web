/* globals describe, before, after, it, expect, browser, testURL, selectors */

describe("When the user clicks on the restore button, it", function() {
    const text = "She put on her boots.";
    let page;
    let popup;

    before(async function() {
        popup = await browser.newPage();
        page = await browser.newPage();

        // TODO Make this not hardcoded
        await popup.goto(
            "chrome-extension://ficejgipfhgebnbdlabicfgkkndjpaoo/src/popup.html"
        );
        await page.goto(testURL + text);
    });

    after(async function() {
        await popup.close();
    });

    it("should restore the original page content", async function() {
        const contents = await page.$eval(selectors.content, e => e.innerText);
        expect(contents).to.equal(text);
    });
});
