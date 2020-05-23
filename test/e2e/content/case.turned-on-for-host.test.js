/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, storage, selectors, testURL, popupURL, optionsURL */

describe("When the extension is re-enabled on this host, the page", function() {
    let page;
    let popup;
    let options;
    const text =
        "On the driveway, she washed her motorcycle while he washed his car.";

    describe("When the user has not yet reloaded the page, it", function() {
        // This case also applies when the user has just installed the
        // extension and hasn't yet reloaded any of their previously-open tabs.
        before(async function() {
            options = await browser.newPage();
            await options.goto(optionsURL);

            // Turn off replacements on this host only
            await storage.set(options, {
                doNotReplaceList: [new URL(testURL).host]
            });

            page = await browser.newPage();
            await page.goto(testURL + text);

            // FIXME The extension is still running asynchronously when the
            // storage gets cleared; then the extension finishes, finding that
            // the host is not in the doNotReplaceList and performing
            // replacements. Running with `slowMo` or waiting "fixes" it.
            await page.waitFor(100);

            await storage.clear(options);

            // Open the popup, but don't yet reload the page
            popup = await browser.newPage();
            await popup.goto(popupURL);
        });

        after(async function() {
            await storage.clear(options);

            await page.close();
            await popup.close();
            await options.close();
        });

        it("should prompt the user to reload", async function() {
            await popup.waitForSelector(selectors.reloadMessage, {
                visible: true
            });

            const reloadText = await popup.$eval(
                selectors.reloadMessage,
                e => e.innerText
            );

            expect(reloadText).to.equal("Reload the page to replace pronouns.");
        });

        it("should show the 'Replace pronouns' checkbox", async function() {
            await popup.waitForSelector(selectors.turnOnForHost, {
                visible: true
            });
        });

        it("the 'Replace pronouns' checkbox should be checked", async function() {
            const isChecked = await popup.$eval(
                selectors.turnOnForHostCheckbox,
                e => e.checked
            );
            //await page.waitFor(100000);
            expect(isChecked).to.be.true;
        });

        it("should show the 'Show changes' checkbox", async function() {
            await popup.waitForSelector(selectors.showChangesCheckbox, {
                visible: false
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

            // Turn off replacements on this host only
            await storage.set(options, {
                doNotReplaceList: [new URL(testURL).host]
            });

            page = await browser.newPage();
            await page.goto(testURL + text);

            await storage.clear(options);

            // Open the popup, but don't yet reload the page
            popup = await browser.newPage();
            await popup.goto(popupURL);
        });

        after(async function() {
            await storage.clear(options);

            await page.close();
            await popup.close();
            await options.close();
        });

        it("should replace personal pronouns", async function() {
            const contents = await page.$eval(
                selectors.content,
                e => e.innerText
            );
            expect(contents).to.equal(
                "On the driveway, they washed their motorcycle while they washed their car."
            );
        });

        it("should explain in the popup", async function() {
            const statusText = await popup.$eval(
                selectors.status,
                e => e.innerText
            );
            expect(statusText).to.equal(
                "Degender the Web has replaced gender pronouns on this page."
            );
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

        it("should not show the 'Reload page' button", async function() {
            await popup.waitForSelector(selectors.reloadPage, {
                visible: false
            });
        });
    });
});
