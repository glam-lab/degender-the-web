/*globals describe, before, after, it, expect, browser, testURL, popupURL, selectors */

function testButton(buttonName) {
    describe(
        "When the user clicks on the " + buttonName + " button, it",
        function() {
            const text = "He washed his car.";
            const restore = buttonName === "restore";
            let page;
            let popup;

            before(async function() {
                page = await browser.newPage();
                await page.goto(testURL + text);

                popup = await browser.newPage();
                await popup.goto(popupURL);

                await popup.click(selectors[buttonName]);
            });

            after(async function() {
                await page.close();
            });

            const description =
                "should " +
                (restore ? "" : "not ") +
                "restore the original page content";

            it(description, async function() {
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

testButton("restore");
