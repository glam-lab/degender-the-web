/*globals before, after, context, specify, expect browser, testURL, textdivSelector */
const compoundPronouns = require("./cases.compound-pronouns.js");
const contractions = require("./cases.contractions.js");
const pronounForms = require("./cases.pronoun-forms.js");
const verbTenses = require("./cases.verb-tenses.js");

context("Grammar", function() {
    let page;

    before(async function() {
        page = await browser.newPage();
    });

    after(function() {
        page.close();
    });

    function testCase(c) {
        if (c.pending) {
            specify(c.descr + " (pending #" + c.pending + ")");
        } else {
            specify(c.descr, async function() {
                await page.goto(testURL + c.in);
                const result = await page.$eval(
                    textdivSelector,
                    e => e.innerText
                );
                expect(result).to.equal(c.out);
            });
        }
    }

    function testAll(cases) {
        if (cases.constructor.name === "Array") {
            cases.forEach(c => testCase(c));
        } else {
            Object.keys(cases).forEach(k =>
                context(k, function() {
                    testAll(cases[k]);
                })
            );
        }
    }

    testAll(pronounForms.cases);
    testAll(compoundPronouns.cases);
    testAll(verbTenses.cases);
    testAll(contractions.cases);
});
