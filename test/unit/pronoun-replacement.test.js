/*eslint no-unused-expressions: "off" */
/*globals describe, beforeEach, it, chai, nlp */
import { allPronouns } from "../../data/pronouns.js";
import { capitalize } from "../../src/capitalization.js";
import {
    hasReplaceablePronouns,
    replaceMatchWithCapitalization,
    pluralizeVerbs,
    replacePossessiveAdjectives,
    spaceAfterPeriod,
    replacePronouns
} from "../../src/pronoun-replacement.js";

const dictionary = allPronouns;
const pronouns = Object.keys(dictionary);

describe("pronoun-replacement.js", function() {
    describe("hasReplaceablePronouns", function() {
        it("should be false for a sentence with no pronouns", function() {
            const sentence = "Janet has a Kliban cat named Ernie.";
            chai.expect(hasReplaceablePronouns(sentence)).to.be.false;
        });
        it("should be false when pronouns appear as parts of other words", function() {
            const words = "shelf there the this";
            chai.expect(hasReplaceablePronouns(words)).to.be.false;
        });
        it("should find any listed pronouns", function() {
            pronouns.forEach(function(p) {
                const text = "blah blah " + p + " blah blah";
                chai.expect(hasReplaceablePronouns(text)).to.be.true;
            });
        });
        it("should be case insensitive", function() {
            pronouns.forEach(function(p) {
                const text = capitalize(p) + " blah blah blah";
                chai.expect(hasReplaceablePronouns(text)).to.be.true;
            });
        });
    });

    describe("replaceMatchWithCapitalization", function() {
        const substitutions = {
            foo: "chicken",
            Foo: "Chicken",
            bar: "chicken",
            Bar: "Chicken",
            foo_bar: "cluck",
            Foo_bar: "Cluck"
        };
        function substitute(word) {
            return substitutions[word];
        }

        let doc;

        beforeEach(function() {
            doc = nlp("Foo (bar) foo. (Foo foo.)");
        });

        it("should work for an uncapitalized word", function() {
            const match = doc.match("foo");
            replaceMatchWithCapitalization(match, substitute);
            chai.expect(doc.all().out("text")).to.include("chicken.");
        });

        it("should work for a capitalized word", function() {
            const match = doc.match("foo");
            replaceMatchWithCapitalization(match, substitute);
            chai.expect(doc.all().out("text")).to.include("Chicken ");
        });

        it("should accept a postfix", function() {
            const match = doc.match("foo");
            replaceMatchWithCapitalization(match, substitute, "_bar");
            chai.expect(doc.all().out("text")).to.include("Cluck (bar) cluck.");
        });

        it("should replace the word if there are parentheses", function() {
            const match = doc.match("bar");
            replaceMatchWithCapitalization(match, substitute);
            chai.expect(doc.all().out("text")).to.include("chicken");
        });

        it("should retain parentheses", function() {
            const match = doc.match("bar");
            replaceMatchWithCapitalization(match, substitute);
            chai.expect(doc.all().out("text")).to.include(" (chicken) ");
        });

        it("should retain parentheses and capitalization together", function() {
            const match = doc.match("foo");
            replaceMatchWithCapitalization(match, substitute);
            chai.expect(doc.all().out("text")).to.include("(Chicken");
        });
    });

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
            const after = pluralizeVerbs(nlp(before)).out("text");
            const regexp = new RegExp("\\b" + verb.plural + "\\b");
            chai.expect(after).to.match(regexp);
        }

        irregularVerbs.forEach(function(verb) {
            it(
                "should replace " + verb.singular + " with " + verb.plural,
                function() {
                    testOne(verb);
                }
            );
        });

        spellingTests.forEach(function(verb) {
            it("should work for verbs ending in " + verb.letter, function() {
                testOne(verb);
            });
        });

        function test(input, output) {
            const result = pluralizeVerbs(nlp(input)).out("text");
            chai.expect(result).to.equal(output);
        }

        it("should work for a statement", function() {
            test("They tries it", "They try it");
        });

        it("should work for a question", function() {
            test("Does they want it?", "Do they want it?");
        });

        it("should work for a negated question", function() {
            test("Does not they want it?", "Do they not want it?");
        });

        it("should correctly capitalize a question not starting with a verb", function() {
            test("Well, does they want it?", "Well, do they want it?");
        });
    });

    describe("replacePossessiveAdjectives", function() {
        function test(input, output) {
            const doc = nlp(input);
            const result = replacePossessiveAdjectives(doc).out("text");
            chai.expect(result).to.equal(output);
        }

        it("should replace possessive adjectives", function() {
            test("her book", "their book");
            test("his book", "their book");
        });

        it("should not replace other uses of 'her'", function() {
            test("it was her", "it was her");
        });

        it("should not replace other uses of 'his'", function() {
            test("it was his", "it was his");
        });

        it("should match capitalization", function() {
            test("Her book was red", "Their book was red");
        });
    });

    describe("fixPunctuation", function() {
        it("should add missing spaces after periods", function() {
            chai.expect(spaceAfterPeriod("Hello.World.")).to.equal(
                "Hello. World. "
            );
        });

        it("should collapse extra spaces after periods", function() {
            chai.expect(spaceAfterPeriod("Hello.     World. ")).to.equal(
                "Hello. World. "
            );
        });

        it("shouldn't delete a space after a period", function() {
            const text = "He is here. She is here.";
            const result = spaceAfterPeriod(text);
            chai.expect(result).to.include(". ");
        });

        it("shouldn't add space between a period and a quotation mark", function() {
            const text = 'He said, "She is here."';
            const result = spaceAfterPeriod(text);
            chai.expect(result).to.include('."');
        });

        it("shouldn't add space between a period and a smart quote", function() {
            // See https://www.linkedin.com/pulse/breakfast-interns-topic-career-prep-im-learning-lot-george-anders/
            const text = "Let’s linger on that word “classic.”";
            const result = spaceAfterPeriod(text);
            chai.expect(result).to.include(".”");
        });
    });

    describe("replacePronouns", function() {
        function theyCount(text) {
            const re = new RegExp("they", "ig");
            let count = 0;
            while (re.exec(text)) count++;
            return count;
        }

        it("should not change a sentence with no pronouns", function() {
            const sentence = "The quick brown fox jumps over the lazy dog. ";
            chai.expect(replacePronouns(sentence)).to.equal(sentence);
        });

        describe("should replace all listed pronouns as specified", function() {
            pronouns.forEach(function(p) {
                it(
                    "should replace " + p + " with " + dictionary[p],
                    function() {
                        const result = replacePronouns(p);
                        chai.expect(result).to.include(dictionary[p]);
                    }
                );
            });
        });

        it("should replace multiple pronouns", function() {
            const sentence = "I said she should go with him. ";
            const result = replacePronouns(sentence);
            chai.expect(result).to.include("they");
            chai.expect(result).to.include("them");
        });

        it("should replace repeated pronouns", function() {
            const sentence = "Well, she can think what she wants. ";
            const result = replacePronouns(sentence);
            chai.expect(theyCount(result)).to.equal(2);
        });

        it("should preferentially replace compound pronouns", function() {
            const result = replacePronouns("he or she");
            chai.expect(theyCount(result)).to.equal(1);
        });

        it("should replace capitalized pronouns", function() {
            // See https://onezero.medium.com/wikipedia-doesnt-know-what-to-do-with-almost-famous-people-f4776193488c
            const text = "Take the case of Jenny. She makes videos for YouTube";
            const result = replacePronouns(text);
            chai.expect(result).to.include("They");
        });

        it("should not replace acronyms", function() {
            const text = "HERS Institute";
            chai.expect(replacePronouns(text)).to.equal(text);
        });

        it("shouldn't get thrown off by a leading period", function() {
            // See https://johnresig.com/about/
            // See also issue #92 re: contractions
            const text = ". He's created numerous JavaScript projects";
            const result = replacePronouns(text);
            chai.expect(result).to.include("They have");
            chai.expect(result).to.match(/^. /);
        });

        it("shouldn't add space before a leading comma", function() {
            // See https://www.linkedin.com/pulse/breakfast-interns-topic-career-prep-im-learning-lot-george-anders/
            const text = ", a software-engineering intern. During his studies";
            const result = replacePronouns(text, true);
            chai.expect(result).to.match(/^, /);
        });

        it("should mark up changes when requested", function() {
            const sentence = "I said she should go. ";
            const result = replacePronouns(sentence, true);
            chai.expect(result).to.match(/<del.*>she *<\/del>/);
            chai.expect(result).to.match(/<ins.*>they *<\/ins>/);
        });
    });
});
