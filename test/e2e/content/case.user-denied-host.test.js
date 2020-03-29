/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, selectors, testURL, popupURL */

describe("When the user has disabled the extension on this host, the page", function() {
    let page;
    let popup;
    const text =
        "On the driveway, she washed her motorcycle while he washed his car.";

    describe("When the user has not yet reloaded the page, it", function() {
        before(async function() {
            // The page is loaded, the content script performs replacements
            page = await browser.newPage();
            await page.goto(testURL + text);

            // Now replacements are turned off for this host
            popup = await browser.newPage();
            await popup.goto(popupURL);

            // Clear the doNotReplaceList
            await popup.evaluate("chrome.storage.sync.clear()");
            await popup.reload();

            await popup.click(selectors.turnOnForHostCheckbox);
        });

        after(async function() {
            await popup.evaluate("chrome.storage.sync.clear()");

            await popup.close();
            await page.close();
        });

        it("should not yet change the status message", async function() {
            const statusText = await popup.$eval(
                selectors.status,
                e => e.innerText
            );

            // The status message remains the same
            expect(statusText).to.equal(
                "Degender the Web has replaced gender pronouns on this page."
            );
        });

        it("should prompt the user to reload", async function() {
            const reloadText = await popup.$eval(
                selectors.reloadMessage,
                e => e.innerText
            );

            expect(reloadText).to.equal(
                "Reload the page to revert pronoun replacements."
            );
        });

        it("should not show the 'Show changes' checkbox", async function() {
            await popup.waitForSelector(selectors.showChangesCheckbox, {
                visible: false
            });
        });

        it("should not show the 'Show highlights' checkbox", async function() {
            await popup.waitForSelector(selectors.showHighlightsCheckbox, {
                visible: false
            });
        });

        it("should not show the 'Restore original content' button", async function() {
            await page.waitForSelector(selectors.restore, { hidden: true });
        });

        it("should show the 'Reload page' button", async function() {
            await popup.waitForSelector(selectors.reloadPage, {
                hidden: false
            });
        });
    });

    describe("When the user opens or reloads the page, it", function() {
        before(async function() {
            // Load the page
            page = await browser.newPage();
            await page.goto(testURL + text);

            popup = await browser.newPage();
            await popup.goto(popupURL);

            // Clear the doNotReplaceList
            await popup.evaluate("chrome.storage.sync.clear()");
            await popup.reload();

            // Turn off replacements, reload popup to simulate re-opening it
            await popup.click(selectors.turnOnForHostCheckbox);
            await page.reload();
            await popup.reload();
        });

        after(async function() {
            await popup.evaluate("chrome.storage.sync.clear()");

            await popup.close();
            await page.close();
        });

        it("should still say 'he' and 'she'", async function() {
            const bodyText = await page.$eval("body", e => e.innerText);
            expect(bodyText).to.include(" he ");
            expect(bodyText).to.include(" she ");
        });

        it("should not have any insertions or deletions", async function() {
            expect(await page.$$(selectors.ins)).to.be.empty;
            expect(await page.$$(selectors.del)).to.be.empty;
        });

        it("should explain in the popup", async function() {
            const statusText = await popup.$eval(
                selectors.status,
                e => e.innerText
            );
            expect(statusText).to.equal(
                "You've turned off Degender the Web for this page."
            );
        });

        it("should not show the 'Show changes' checkbox", async function() {
            await popup.waitForSelector(selectors.showChangesCheckbox, {
                visible: false
            });
        });

        it("should not show the 'Show highlights' checkbox", async function() {
            await popup.waitForSelector(selectors.showHighlightsCheckbox, {
                visible: false
            });
        });

        it("should not show the 'Restore original content' button", async function() {
            await page.waitForSelector(selectors.restore, { hidden: true });
        });

        it("should not show the 'Reload page' button", async function() {
            await popup.waitForSelector(selectors.reloadPage, { hidden: true });
        });
    });
});
