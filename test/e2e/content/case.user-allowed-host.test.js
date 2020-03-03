/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, testURL, popupURL, optionsURL, selectors */

// TODO Combine the two instances of this function in bootstrap.js
//      or move it entirely into the `before` block
async function setDenyList(options, text) {
    await options.$eval(
        selectors.denyList,
        (e, host) => (e.value = host),
        text
    );
    await options.click(selectors.saveDenyList);

    // Now wait for the "Options saved" message
    await options.waitForSelector(selectors.status, {
        visible: true
    });
}

describe("When the user has re-enabled the extension on this host, the page", function() {
    let options;
    let page;
    let popup;
    const text = "She washed her motorcycle. He washed his car.";

    before(async function() {
        this.timeout(10000);
        options = await browser.newPage();
        await options.goto(optionsURL);
        await setDenyList(options, "");

        page = await browser.newPage();
        await page.goto(testURL + text);

        popup = await browser.newPage();
        await popup.goto(popupURL);
    });

    // TODO This is a pretty shallow test, but I think it's adequate?
    it("should replace personal pronouns", async function() {
        const contents = await page.$eval(selectors.content, e => e.innerText);
        expect(contents).to.equal(
            "They washed their motorcycle. They washed their car."
        );
    });

    after(async function() {
        await options.close();
        await page.close();
        await popup.close();
    });
});
