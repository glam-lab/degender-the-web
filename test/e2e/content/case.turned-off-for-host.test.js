/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, storage, selectors, testURL, popupURL, optionsURL */

describe("When the extension is turned off for this host, the page", function() {
    let page;
    let popup;
    let options;
    const text =
        "On the driveway, she washed her motorcycle while he washed his car.";

    describe("When the user has not yet reloaded the page, it", function() {
        before(async function() {
            options = await browser.newPage();
            await options.goto(optionsURL);
            page = await browser.newPage();
            await page.goto(testURL + text);
            popup = await browser.newPage();

            // Turn off replacements on this host only
            await storage.set(options, {
                doNotReplaceList: [new URL(testURL).host]
            });

            // Open the popup, but don't yet reload the page
            await popup.goto(popupURL);
        });

        after(async function() {
            await storage.clear(options);

            await popup.close();
            await page.close();
            await options.close();
        });

        it("should not yet change the status message", async function() {
            await popup.waitForSelector(selectors.status, {
                visible: true
            });

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
            await popup.waitForSelector(selectors.reloadMessage, {
                visible: true
            });

            const reloadText = await popup.$eval(
                selectors.reloadMessage,
                e => e.innerText
            );

            expect(reloadText).to.equal(
                "Reload the page to revert pronoun replacements."
            );
        });

        it("should show the 'Replace pronouns' checkbox", async function() {
            await popup.waitForSelector(selectors.turnOnForHost, {
                visible: true
            });
        });

        it("the 'Replace pronouns' checkbox should be unchecked", async function() {
            const isChecked = await popup.$eval(
                selectors.turnOnForHostCheckbox,
                e => e.checked
            );
            expect(isChecked).to.be.false;
        });

        it("should show the 'Show changes' checkbox", async function() {
            await popup.waitForSelector(selectors.showChangesCheckbox, {
                visible: true
            });
        });

        it("should not show the 'Show highlights' checkbox", async function() {
            await popup.waitForSelector(selectors.showHighlightsCheckbox, {
                visible: false
            });
        });

        it("should show the 'Reload page' button", async function() {
            await popup.waitForSelector(selectors.reloadPage, {
                visible: true
            });
        });
    });

    describe("When the user opens or reloads the page, it", function() {
        before(async function() {
            options = await browser.newPage();
            await options.goto(optionsURL);
            page = await browser.newPage();
            await page.goto(testURL + text);
            popup = await browser.newPage();
            await popup.goto(popupURL);

            // FIXME The extension is still running asynchronously when the
            // storage gets cleared; then the extension finishes, finding that
            // the host is not in the doNotReplaceList and performing
            // replacements. Running with `slowMo` or waiting "fixes" it.
            await page.waitFor(100);

            // Turn off replacements, reload popup to simulate re-opening it
            await storage.set(options, {
                doNotReplaceList: [new URL(testURL).host]
            });
            await page.reload();
            await popup.reload();
        });

        after(async function() {
            await storage.clear(options);

            await popup.close();
            await page.close();
            await options.close();
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

        it("should not show the 'Reload page' button", async function() {
            await popup.waitForSelector(selectors.reloadPage, {
                visible: false
            });
        });
    });
});
