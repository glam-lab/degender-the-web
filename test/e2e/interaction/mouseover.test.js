/*eslint no-unused-expressions: "off" */
/*globals describe, beforeEach, afterEach, it, expect, browser, testURL, replacementSelector */

describe("When the user mouses over the replacement span, it", function() {
    let page;
    const text = "What if he or she doesn't answer?";

    beforeEach(async function() {
        page = await browser.newPage();
        await page.goto(testURL + text);
    });

    afterEach(async function() {
        await page.close();
    });

    it("should show the original word or phrase", async function() {
        const replacementHandle = await page.$(replacementSelector);
        await replacementHandle.hover();
        const hoverText = await page.$eval(
            replacementSelector,
            e => e.innerText
        );
        expect(hoverText).to.equal("he or she");
    });

    it.skip("should not move or change size (pending resolution of #15)", async function() {
        const replacementHandle = await page.$(replacementSelector);
        const plainBoundingBox = await replacementHandle.boundingBox();
        await replacementHandle.hover();
        const hoverBoundingBox = await replacementHandle.boundingBox();
        expect(hoverBoundingBox).to.equal(plainBoundingBox);
    });
});
