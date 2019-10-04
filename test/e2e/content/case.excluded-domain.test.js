/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, unsupportedURL, popupURL, selectors */

/* Ideally, we should test accessing a page in an excluded domain, such as facebook.com. However, that requires actually loading the extension, which I have not managed to do successfully. These pending tests are here as a placeholder to remind us this use case is not tested. */

describe("When the page is in an excluded domain, it", function() {
    let page;
    let popup;
    let originalContent;

    before(async function() {
        this.timeout(8000); // Loading Facebook can take more than 7 seconds.
        page = await browser.newPage();
        await page.goto(unsupportedURL);

        popup = await browser.newPage();
        await popup.goto(popupURL);

        originalContent = await page.$eval("body", e => e.innerText);
    });

    after(async function() {
        await page.close();
        await popup.close();
    });

    it("should load the Chrome extension");

    it("should not change the text", async function() {
        const content = await page.$eval("body", e => e.innerText);
        expect(content).to.equal(originalContent);
    });

    it("should explain in the popup", async function() {
        const statusText = await popup.$eval(
            selectors.status,
            e => e.innerText
        );
        expect(statusText).to.include("does not run on");
    });

    it("the popup should not have a 'Show changes/highlights' button", async function() {
        expect(page.$(selectors.toggle)).to.be.empty;
    });
});
