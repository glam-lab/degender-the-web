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
        const headerText = await popup.$eval(
            selectors.status,
            e => e.innerText
        );
        expect(headerText).to.include("replaced gender pronouns");
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

    it("should have a checkbox for 'Show changes' in the popup", async function() {
        const toggleID = selectors.toggle.replace("#", "");
        const labelText = await popup.$eval(
            "[for=" + toggleID + "]",
            e => e.innerText
        );
        expect(labelText).to.equal("Show changes");

        const checkbox = await popup.$$(
            "input[type=checkbox]" + selectors.toggle
        );
        expect(checkbox).to.not.be.empty;
    });

    describe("When the user clicks 'Show changes', it", function() {
        before(async function() {
            await page.waitForSelector(selectors.toggle, { visible: true });
            await popup.click(selectors.toggle);
        });

        it("should show inserted and deleted text", async function() {
            await page.waitForSelector(selectors.ins, { visible: true });
            await page.waitForSelector(selectors.del, { visible: true });
        });

        it.skip("should change the button to 'Hide changes'", async function() {
            const buttonText = await popup.$eval(
                selectors.toggle,
                e => e.innerText
            );
            expect(buttonText).to.equal("Hide changes");
        });
    });

    describe("When the user clicks 'Hide changes', it", function() {
        before(async function() {
            await popup.click(selectors.toggle);
        });

        it("should show only inserted text", async function() {
            await page.waitForSelector(selectors.ins, { visible: true });
            await page.waitForSelector(selectors.del, { visible: false });
        });

        it.skip("should change the button to 'Show changes'", async function() {
            const buttonText = await popup.$eval(
                selectors.toggle,
                e => e.innerText
            );
            expect(buttonText).to.equal("Show changes");
        });
    });
});
