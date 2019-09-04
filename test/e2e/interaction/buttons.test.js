/*globals describe, before, after, it, expect, browser, testURL, headerSelector, textdivSelector */

function testButton(buttonID) {
    describe(
        "When the user clicks on the " + buttonID + " button, it",
        function() {
            const text = "He washed his car.";
            const restore = buttonID === "restore";
            let page;

            before(async function() {
                page = await browser.newPage();
                await page.goto(testURL + text);
                await page.click(headerSelector + " > #" + buttonID);
            });

            after(async function() {
                await page.close();
            });

            it("should dismiss the header", async function() {
                page.waitForSelector(headerSelector, { hidden: true });
            });

            const description =
                "should " +
                (restore ? "" : "not ") +
                "restore the original page content";
            it(description, async function() {
                const contents = await page.$eval(
                    textdivSelector,
                    e => e.innerText
                );
                if (restore) {
                    expect(contents).to.equal(text);
                } else {
                    expect(contents).to.not.equal(text);
                }
            });
        }
    );
}

testButton("dismiss");
testButton("restore");
