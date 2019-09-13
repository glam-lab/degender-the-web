/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, testURL, 
          textdivSelector, highlightSelector, headerSelector, 
          insSelector, delSelector, toggleSelector */

describe("When the page includes gender pronouns, it", function() {
    let page;
    const text = "She washed her motorcycle. He washed his car.";

    before(async function() {
        page = await browser.newPage();
        await page.goto(testURL + text);
    });

    after(async function() {
        await page.close();
    });

    it("should replace personal pronouns", async function() {
        const contents = await page.$eval(textdivSelector, e => e.innerText);
        expect(contents).to.equal(
            "They washed their motorcycle. They washed their car."
        );
    });

    it("should explain in the header", async function() {
        const headerText = await page.$eval(headerSelector, e => e.innerText);
        expect(headerText).to.include("replaced gender pronouns");
    });

    it("should not have any changes", async function() {
        const changes = await page.$$(highlightSelector);
        expect(changes).to.be.empty;
    });

    it("should have insertions", async function() {
        const insertions = await page.$$(insSelector);
        expect(insertions).not.to.be.empty;
    });

    it("should have deletions", async function() {
        const deletions = await page.$$(delSelector);
        expect(deletions).not.to.be.empty;
    });

    it("should show inserted text", async function() {
        await page.waitForSelector(insSelector, { visible: true });
    });

    it("should not show deleted text", async function() {
        await page.waitForSelector(delSelector, { hidden: true });
    });

    it("should have a button 'Show changes'", async function() {
        const buttonText = await page.$eval(toggleSelector, e => e.innerText);
        expect(buttonText).to.equal("Show changes");
    });

    describe("When the user clicks 'Show changes', it", function() {
        before(async function() {
            const buttonText = await page.$eval(
                toggleSelector,
                e => e.innerText
            );
            expect(buttonText).to.equal("Show changes");
            await page.click(toggleSelector);
        });

        it("should show inserted and deleted text", async function() {
            await page.waitForSelector(insSelector, { visible: true });
            await page.waitForSelector(delSelector, { visible: true });
        });

        it("should change the button to 'Hide changes'", async function() {
            const buttonText = await page.$eval(
                toggleSelector,
                e => e.innerText
            );
            expect(buttonText).to.equal("Hide changes");
        });
    });

    describe("When the user clicks 'Hide changes', it", function() {
        before(async function() {
            const buttonText = await page.$eval(
                toggleSelector,
                e => e.innerText
            );
            expect(buttonText).to.equal("Hide changes");
            await page.click(toggleSelector);
        });

        it("should show only inserted text", async function() {
            await page.waitForSelector(insSelector, { visible: true });
            await page.waitForSelector(delSelector, { visible: false });
        });

        it("should change the button to 'Show changes'", async function() {
            const buttonText = await page.$eval(
                toggleSelector,
                e => e.innerText
            );
            expect(buttonText).to.equal("Show changes");
        });
    });
});
