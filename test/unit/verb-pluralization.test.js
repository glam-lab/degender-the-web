/*eslint no-unused-expressions: "off" */
/*globals describe, it, chai */
import { pluralizeVerbs } from "../../src/verb-pluralization.js";

describe("verb-pluralization.js", function() {
    describe("pluralizeVerbs", function() {
        const irregularVerbs = [
            { singular: "is", plural: "are" },
            { singular: "was", plural: "were" },
            { singular: "has", plural: "have" }
        ];

        //See spelling rules at
        // https://www.really-learn-english.com/spelling-rules-add-s-verb.html
        const spellingTests = [
            { letter: "e", singular: "makes", plural: "make" },
            { letter: "s", singular: "misses", plural: "miss" },
            { letter: "ch", singular: "bunches", plural: "bunch" },
            { letter: "sh", singular: "wishes", plural: "wish" },
            { letter: "x", singular: "boxes", plural: "box" },
            { letter: "z", singular: "buzzes", plural: "buzz" },
            { letter: "o", singular: "goes", plural: "go" },
            { letter: "y", singular: "tries", plural: "try" },
            { letter: "a consonant", singular: "eats", plural: "eat" }
        ];

        function testOne(verb) {
            const before = "They " + verb.singular + " it.";
            const after = pluralizeVerbs(before);
            const regexp = new RegExp("\\b" + verb.plural + "\\b");
            chai.expect(after).to.match(regexp);
        }

        irregularVerbs.forEach(function(verb) {
            const descr =
                "should replace " + verb.singular + " with " + verb.plural;
            it(descr, function() {
                testOne(verb);
            });
        });

        spellingTests.forEach(function(verb) {
            it("should work for verbs ending in " + verb.letter, function() {
                testOne(verb);
            });
        });

        it("should work for a statement", function() {
            chai.expect(pluralizeVerbs("They tries it")).to.equal(
                "They try it"
            );
        });

        it("should work for a question", function() {
            chai.expect(pluralizeVerbs("Does they want it?")).to.equal(
                "Do they want it?"
            );
        });
    });
});
