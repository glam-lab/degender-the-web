/*eslint no-unused-expressions: "off" */
/*globals describe, before, after, it, expect, browser, testURL, highlightSelector, headerSelector */

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

    it("should highlight the word 'gender'", async function() {
        const highlightText = await page.$eval(
            highlightSelector,
            e => e.innerText
        );
        expect(highlightText).to.equal("gender");
    });

    it("should explain in the header", async function() {
        const headerText = await page.$eval(headerSelector, e => e.innerText);
        expect(headerText).to.include("gender");
    });
});
