/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, testURL, popupURL, selectors */

describe("When the page includes the stopword 'gender', it", function() {
    let page;
    let popup;
    const text =
        "This page is about gender pronouns. " +
        "Words like he and she should not be changed.";

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

    it("should still say 'he' and 'she'", async function() {
        const bodyText = await page.$eval("body", e => e.innerText);
        expect(bodyText).to.include(" he ");
        expect(bodyText).to.include(" she ");
    });

    it("should not have any insertions or deletions", async function() {
        expect(await page.$$(selectors.ins)).to.be.empty;
        expect(await page.$$(selectors.del)).to.be.empty;
    });

    it("should highlight the word 'gender'", async function() {
        const highlightText = await page.$eval(
            selectors.highlight,
            e => e.innerText
        );
        expect(highlightText).to.equal("gender");
    });

    it("should not initially show those highlights", async function() {
        expect(await page.$$(selectors.highlight + ".show")).to.be.empty;
    });

    it("should explain in the popup", async function() {
        const statusText = await popup.$eval(
            selectors.status,
            e => e.innerText
        );
        expect(statusText).to.include("gender");
    });

    it("should have a visible checkbox for 'Show highlights' in the popup", async function() {
        // This gets the label associated with the checkbox
        const checkboxID = selectors.showHighlightsCheckbox.replace("#", "");
        const labelText = await popup.$eval(
            "[for=" + checkboxID + "]",
            e => e.innerText
        );
        expect(labelText).to.equal("Show highlights");

        const isChecked = await popup.$eval(
            "input[type=checkbox]" + selectors.showHighlightsCheckbox,
            e => e.checked
        );
        expect(isChecked).to.be.false;
    });

    it("should hide the 'Show changes' checkbox", async function() {
        const checkbox = await popup.waitForSelector(
            selectors.showChangesCheckbox,
            { visible: false }
        );
        expect(checkbox).to.not.be.empty;
    });

    describe("When the user checks the 'Show highlights' box", function() {
        before(async function() {
            await popup.click(selectors.showHighlightsCheckbox);
        });
        it("should show them all", async function() {
            expect(await page.$$(selectors.highlight + ".show")).not.to.be
                .empty;
            expect(await page.$$(selectors.highlight + ".hide")).to.be.empty;
        });
    });

    describe("When the user unchecks the 'Show highlights' box", function() {
        before(async function() {
            await popup.click(selectors.showHighlightsCheckbox);
        });
        it("should hide them all", async function() {
            expect(await page.$$(selectors.highlight + ".show")).to.be.empty;
            expect(await page.$$(selectors.highlight + ".hide")).not.to.be
                .empty;
        });
    });
});
