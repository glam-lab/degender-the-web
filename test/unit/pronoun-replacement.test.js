/*eslint no-unused-expressions: "off" */
/*globals describe, it, chai */
import { allPronouns } from "../../data/pronouns.js";
import { capitalize } from "../../src/word-replacement.js";
import {
    hasReplaceablePronouns,
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

    describe("replacePronouns", function() {
        it("should not change a sentence with no pronouns", function() {
            const sentence = "The quick brown fox jumps over the lazy dog.";
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
            const sentence = "I said she should go with him.";
            const result = replacePronouns(sentence);
            chai.expect(result).to.include("they");
            chai.expect(result).to.include("them");
        });
        it("should replace repeated pronouns", function() {
            const sentence = "Well, she can think what she wants.";
            const result = replacePronouns(sentence);
            const re = new RegExp(">they<", "ig");
            let count = 0;
            while (re.exec(result)) count++;
            chai.expect(count).to.equal(2);
        });
        it("should preferentially replace compound pronouns", function() {
            const result = replacePronouns("he or she");
            chai.expect(result).to.include(">they<");
        });
        it("should replace capitalized pronouns", function() {
            const text = "Take the case of Jenny. She makes videos for YouTube";
            const result = replacePronouns(text);
            chai.expect(result).to.include("They");
        });
        it("should not replace acronyms", function() {
            const text = "HERS Institute";
            chai.expect(replacePronouns(text)).to.equal(text);
        });
    });
});
