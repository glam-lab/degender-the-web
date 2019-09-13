/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, testURL, highlightSelector, insSelector, delSelector, headerSelector, toggleSelector */

describe("When the page includes the stopword 'gender', it", function() {
    let page;
    const text =
        "This page is about gender pronouns. " +
        "Words like he and she should not be changed.";

    before(async function() {
        page = await browser.newPage();
        await page.goto(testURL + text);
    });

    after(async function() {
        await page.close();
    });

    it("should still say 'he' and 'she'", async function() {
        const bodyText = await page.$eval("body", e => e.innerText);
        expect(bodyText).to.include(" he ");
        expect(bodyText).to.include(" she ");
    });

    it("should not have any insertions or deletions", async function() {
        expect(await page.$$(insSelector)).to.be.empty;
        expect(await page.$$(delSelector)).to.be.empty;
    });

    it("should highlight the word 'gender'", async function() {
        const highlightText = await page.$eval(
            highlightSelector,
            e => e.innerText
        );
        expect(highlightText).to.equal("gender");
    });

    it("should not initially show those highlights", async function() {
        expect(await page.$$(highlightSelector + ".show")).to.be.empty;
    });

    it("should explain in the header", async function() {
        const headerText = await page.$eval(headerSelector, e => e.innerText);
        expect(headerText).to.include("gender");
    });

    it("should have a button to 'Show highlights'", async function() {
        const buttonText = await page.$eval(toggleSelector, e => e.innerText);
        expect(buttonText).to.equal("Show highlights");
    });

    describe("When the user clicks 'Show highlights'", function() {
        before(async function() {
            await page.click(toggleSelector);
        });
        it("should show them all", async function() {
            expect(await page.$$(highlightSelector + ".show")).not.to.be.empty;
            expect(await page.$$(highlightSelector + ".hide")).to.be.empty;
        });
        it("should change the button to 'Hide highlights'", async function() {
            const buttonText = await page.$eval(
                toggleSelector,
                e => e.innerText
            );
            expect(buttonText).to.equal("Hide highlights");
        });
    });

    describe("When the user clicks 'Hide highlights'", function() {
        before(async function() {
            await page.click(toggleSelector);
        });
        it("should hide them all", async function() {
            expect(await page.$$(highlightSelector + ".show")).to.be.empty;
            expect(await page.$$(highlightSelector + ".hide")).not.to.be.empty;
        });
        it("should change the button to 'Show highlights'", async function() {
            const buttonText = await page.$eval(
                toggleSelector,
                e => e.innerText
            );
            expect(buttonText).to.equal("Show highlights");
        });
    });
});
