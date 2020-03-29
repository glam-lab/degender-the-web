/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, testURL, popupURL, selectors */

describe("When the user has re-enabled the extension on this host, the page", function() {
    let page;
    let popup;
    const text = "She washed her motorcycle. He washed his car.";

    before(async function() {
        page = await browser.newPage();
        await page.goto(testURL + text);

        popup = await browser.newPage();
        await popup.goto(popupURL);
    });

    it("should replace personal pronouns", async function() {
        const contents = await page.$eval(selectors.content, e => e.innerText);
        expect(contents).to.equal(
            "They washed their motorcycle. They washed their car."
        );
    });

    after(async function() {
        await page.close();
        await popup.close();
    });
});
