/*globals describe, before, after, it, expect, browser, testURL, selectors */

function testButton(buttonName) {
    describe(
        "When the user clicks on the " + buttonName + " button, it",
        function() {
            const text = "He washed his car.";
            const restore = buttonName === "restore";
            let page;

            before(async function() {
                page = await browser.newPage();
                await page.goto(testURL + text);
                // Disabled to be re-implemented for popup
                //await page.click(selectors[buttonName]);
            });

            after(async function() {
                await page.close();
            });

            const description =
                "should " +
                (restore ? "" : "not ") +
                "restore the original page content";

            // Disabled to be re-implemented for popup
            it.skip(description, async function() {
                const contents = await page.$eval(
                    selectors.content,
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
