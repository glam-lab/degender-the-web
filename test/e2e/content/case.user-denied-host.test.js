/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, selectors, testURL, testHost, popupURL, optionsURL, setDenyList */

describe("When the user has disabled the extension on this host, the page", function() {
    let options;
    let page;
    let originalContent;
    let popup;
    const text = "She washed her motorcycle. He washed his car.";

    describe("When the user has not yet reloaded the page, it", function() {
        before(async function() {
            options = await browser.newPage();
            await options.goto(optionsURL);

            // The list must be empty before loading the page
            await setDenyList(options, "");

            // The page is loaded, the content script performs replacements
            page = await browser.newPage();
            await page.goto(testURL + text);

            // Now the page is added to the list
            await setDenyList(options, testHost);

            popup = await browser.newPage();
            await popup.goto(popupURL);
        });

        after(async function() {
            await popup.close();
            await page.close();
            await setDenyList(options, "");
            await options.close();
        });

        it.only("should explain in the popup", async function() {
            const statusText = await popup.$eval(
                selectors.status,
                e => e.innerText
            );
            expect(statusText).to.equal(
                "You've turned off Degender the Web for this page. " +
                    "Reload the page to revert pronoun replacements."
            );
        });

        it.only("should not show the 'Show changes' checkbox", async function() {
            await popup.waitForSelector(selectors.showChangesCheckbox, {
                visible: false
            });
        });

        it.only("should not show the 'Show highlights' checkbox", async function() {
            await popup.waitForSelector(selectors.showHighlightsCheckbox, {
                visible: false
            });
        });

        it.only("should not show the 'Restore original content' button", async function() {
            await page.waitForSelector(selectors.restore, { hidden: true });
        });

        it.only("should show the 'Reload page' button", async function() {
            await popup.waitForSelector(selectors.reloadPage, {
                hidden: false
            });
        });
    });

    describe("When the user opens or reloads the page, it", function() {
        before(async function() {
            options = await browser.newPage();
            await options.goto(optionsURL);
            await setDenyList(options, testHost);

            page = await browser.newPage();
            await page.goto(testURL + text);

            popup = await browser.newPage();
            await popup.goto(popupURL);

            originalContent = await page.$eval("body", e => e.innerText);
        });

        it("should not change the text", async function() {
            const content = await page.$eval("body", e => e.innerText);
            expect(content).to.equal(originalContent);
        });

        it.only("should explain in the popup", async function() {
            const statusText = await popup.$eval(
                selectors.status,
                e => e.innerText
            );
            expect(statusText).to.equal(
                "You've turned off Degender the Web for this page."
            );
        });

        it.only("should not show the 'Show changes' checkbox", async function() {
            await popup.waitForSelector(selectors.showChangesCheckbox, {
                visible: false
            });
        });

        it.only("should not show the 'Show highlights' checkbox", async function() {
            await popup.waitForSelector(selectors.showHighlightsCheckbox, {
                visible: false
            });
        });

        it.only("should not show the 'Restore original content' button", async function() {
            await page.waitForSelector(selectors.restore, { hidden: true });
        });

        it.only("should not show the 'Reload page' button", async function() {
            await popup.waitForSelector(selectors.reloadPage, { hidden: true });
        });
    });
});
