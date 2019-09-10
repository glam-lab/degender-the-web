/*globals context, specify, chai */
import { compoundPronouns } from "./cases.compound-pronouns.js";
import { contractions } from "./cases.contractions.js";
import { pronounForms } from ".//cases.pronoun-forms.js";
import { verbTenses } from "./cases.verb-tenses.js";

import { replacePronouns } from "../../../src/pronoun-replacement.js";

context("Grammar", function() {
    function testCase(c) {
        if (c.pending) {
            specify(c.descr + " (pending #" + c.pending + ")");
        } else {
            specify(c.descr, function() {
                chai.expect(replacePronouns(c.in)).to.equal(c.out);
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

    testAll(pronounForms);
    testAll(compoundPronouns);
    testAll(verbTenses);
    testAll(contractions);
});
