/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, testURL, popupURL, selectors */

describe("When the page includes gender pronouns, it", function() {
    let page;
    let popup;
    const text = "She washed her motorcycle. He washed his car.";

    before(async function() {
        page = await browser.newPage();
        await page.goto(testURL + text);

        popup = await browser.newPage();
        await popup.goto(popupURL);
    });

    after(async function() {
        await page.close();
        await popup.close();
    });

    it("should replace personal pronouns", async function() {
        const contents = await page.$eval(selectors.content, e => e.innerText);
        expect(contents).to.equal(
            "They washed their motorcycle. They washed their car."
        );
    });

    it("should explain in the popup", async function() {
        const statusText = await popup.$eval(
            selectors.status,
            e => e.innerText
        );
        expect(statusText).to.include("replaced gender pronouns");
    });

    it("should not have any changes", async function() {
        const changes = await page.$$(selectors.highlight);
        expect(changes).to.be.empty;
    });

    it("should have insertions", async function() {
        const insertions = await page.$$(selectors.ins);
        expect(insertions).not.to.be.empty;
    });

    it("should have deletions", async function() {
        const deletions = await page.$$(selectors.del);
        expect(deletions).not.to.be.empty;
    });

    it("should show inserted text", async function() {
        await page.waitForSelector(selectors.ins, { visible: true });
    });

    it("should not show deleted text", async function() {
        await page.waitForSelector(selectors.del, { hidden: true });
    });

    it("should have a visible 'Show changes' checkbox", async function() {
        // This gets the label associated with the checkbox
        const checkboxID = selectors.showChangesCheckbox.replace("#", "");
        const labelText = await popup.$eval(
            "[for=" + checkboxID + "]",
            e => e.innerText
        );
        expect(labelText).to.equal("Show changes");

        const isChecked = await popup.$eval(
            "input[type=checkbox]" + selectors.showChangesCheckbox,
            e => e.checked
        );
        expect(isChecked).to.be.false;
    });

    it("should hide the 'Show highlights' checkbox", async function() {
        const checkbox = await popup.waitForSelector(
            selectors.showHighlightsCheckbox,
            { visible: false }
        );
        expect(checkbox).to.not.be.empty;
    });

    describe("When the user checks 'Show changes', it", function() {
        before(async function() {
            await popup.waitForSelector(selectors.showChangesCheckbox, {
                visible: true
            });
            await popup.click(selectors.showChangesCheckbox);
        });

        it("should show inserted and deleted text", async function() {
            await page.waitForSelector(selectors.ins, { visible: true });
            await page.waitForSelector(selectors.del, { visible: true });
        });
    });

    describe("When the user unchecks 'Show changes', it", function() {
        before(async function() {
            await popup.click(selectors.showChangesCheckbox);
        });

        it("should show only inserted text", async function() {
            await page.waitForSelector(selectors.ins, { visible: true });
            await page.waitForSelector(selectors.del, { visible: false });
        });
    });
});
