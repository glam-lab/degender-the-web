/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, blacklistedURL */

describe("When the user has disabled the extension on this host, the page", function() {
    let page;
    // TODO Add popup message tests
    //let popup;
    //let originalContent;

    before(async function() {
        // The blacklisted page isn't local and can take a bit longer to load.
        this.timeout(3000);

        page = await browser.newPage();
        await page.goto(blacklistedURL);

        //originalContent = await page.$eval("body", e => e.innerText);
    });

    after(async function() {
        await page.close();
        //await popup.close();
    });

    it("should still say 'he'", async function() {
        const bodyText = await page.$eval("body", e => e.innerText);
        expect(bodyText).to.include(" he ");
    });

    it("should not have any insertions or deletions");

    it("should explain in the popup");

    it("should not show the 'Show changes' checkbox");

    it("should not show the 'Show highlights' checkbox");

    it("should not show the 'Restore original content' button");

    it("should not show the 'Reload page' button");
});
