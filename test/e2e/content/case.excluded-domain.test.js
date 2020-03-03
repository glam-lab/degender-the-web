/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, unsupportedURL, popupURL, selectors */

describe("When the page is in an excluded domain, it", function() {
    let page;
    let popup;
    let originalContent;

    before(async function() {
        this.timeout(10000); // Loading Facebook can take more than 8 seconds.
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

    it("should not show the 'Show changes' checkbox", async function() {
        await page.waitForSelector(selectors.showChanges, {
            hidden: true
        });
    });

    it("should not show the 'Show highlights' checkbox", async function() {
        await page.waitForSelector(selectors.showHighlights, {
            hidden: true
        });
    });

    it("should not show the 'Restore original content' button", async function() {
        await page.waitForSelector(selectors.restore, {
            hidden: true
        });
    });

    it("should not show the 'Reload page' button", async function() {
        await page.waitForSelector(selectors.reloadPage, {
            hidden: true
        });
    });
});
