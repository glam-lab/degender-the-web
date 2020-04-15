/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, storage, selectors, testURL, popupURL, optionsURL */

describe("When the user has re-enabled the extension on this host, the page", function() {
    let page;
    let popup;
    let options;
    const text = "She washed her motorcycle. He washed his car.";

    before(async function() {
        options = await browser.newPage();
        await options.goto(optionsURL);
        storage.clear(options);
        page = await browser.newPage();
        await page.goto(testURL + text);

        popup = await browser.newPage();
        await popup.goto(popupURL);
    });

    after(async function() {
        await page.close();
        await popup.close();
        await options.close();
    });

    it("should replace personal pronouns", async function() {
        const contents = await page.$eval(selectors.content, e => e.innerText);
        expect(contents).to.equal(
            "They washed their motorcycle. They washed their car."
        );
    });
});
