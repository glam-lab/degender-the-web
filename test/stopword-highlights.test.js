/*eslint no-unused-expressions: "off" */
/*globals describe, it, chai */
import { personalPronounSpecs } from "../data/personal-pronoun-specs.js";
import {
    mentionsGender,
    highlightGender,
    hasPersonalPronounSpec,
    getPersonalPronounSpecs,
    highlightPersonalPronounSpecs
} from "../src/stopword-highlights.js";

const genderWords = ["gender", "transgender", "gender-normative", "Gender"];

describe("stopword-highlights.js", function() {
    describe("mentionsGender", function() {
        it("should be false for text not containing 'gender'", function() {
            chai.expect(mentionsGender("blah blah blah")).to.be.false;
        });
        genderWords.forEach(function(w) {
            it("should be true for text containing '" + w + "'", function() {
                const text = "blah blah " + w + " blah blah";
                chai.expect(mentionsGender(text)).to.be.true;
            });
        });
    });

    describe("highlightGender", function() {
        it("should not change text not containing 'gender'", function() {
            const text = "blah blah blah";
            chai.expect(highlightGender(text)).to.equal(text);
        });
        genderWords.forEach(function(w) {
            it("should highlight the word '" + w + "'", function() {
                const text = "blah blah " + w + " blah blah";
                const result = highlightGender(text);
                chai.expect(result).to.include("highlight");
            });
        });
    });

    describe("hasPersonalPronounSpec", function() {
        it("should be false for text without any specifiers", function() {
            const texts = ["blah blah", "either/or", "w/o sauce", "a / c"];
            texts.forEach(function(t) {
                chai.expect(hasPersonalPronounSpec(t)).to.be.false;
            });
        });
        it("should be true for a sentence containing 'she/her'", function() {
            chai.expect(hasPersonalPronounSpec("I use she/her pronouns.")).to.be
                .true;
        });
        it("should be true for text with any listed specifier", function() {
            personalPronounSpecs.forEach(function(pp) {
                chai.expect(hasPersonalPronounSpec(pp)).to.be.true;
            });
        });
        it("should ignore whitespace around the slash", function() {
            chai.expect(hasPersonalPronounSpec("I use she /  her pronouns")).to
                .be.true;
        });
    });

    describe("getPersonalPronounSpecs", function() {
        it("should be empty for text without any specifiers", function() {
            chai.expect(getPersonalPronounSpecs("blah blah blah")).to.be.empty;
            chai.expect(getPersonalPronounSpecs("either/or")).to.be.empty;
        });
        it("should find 'she/her'", function() {
            chai.expect(
                getPersonalPronounSpecs("I use she/her pronouns.")
            ).to.equal("she/her");
        });
        it("should find any listed personal pronoun specifier", function() {
            personalPronounSpecs.forEach(function(pp) {
                chai.expect(
                    getPersonalPronounSpecs("I use " + pp + " pronouns.")
                ).to.equal(pp);
            });
        });
        it("should list multiple specifiers with commas", function() {
            const text = "I use either they/them or ey/em.";
            chai.expect(getPersonalPronounSpecs(text)).to.equal(
                "ey/em, they/them"
            );
        });
        it("should ignore whitespace around the slash", function() {
            chai.expect(
                getPersonalPronounSpecs("I use she /  her pronouns")
            ).to.equal("she/her");
        });
    });

    describe("highlightPersonalPronounSpecs", function() {
        it("should not change text with no personal pronoun specs", function() {
            const text = "Tea or coffee is an either/or thing.";
            chai.expect(highlightPersonalPronounSpecs(text)).to.equal(text);
        });
        it("should highlight 'she/her'", function() {
            const text = "I use she/her pronouns.";
            chai.expect(highlightPersonalPronounSpecs(text)).to.include(
                "highlight"
            );
        });
        it("should highlight any listed personal pronoun spec", function() {
            personalPronounSpecs.forEach(function(pp) {
                chai.expect(
                    highlightPersonalPronounSpecs("I use " + pp + " pronouns.")
                ).to.include("highlight");
            });
        });
        it("should highlight multiple personal pronoun specs", function() {
            const text = "I use either they/them or ey/em.";
            const result = highlightPersonalPronounSpecs(text);
            const re = new RegExp("highlight", "g");
            let count = 0;
            while (re.exec(result)) count++;
            chai.expect(count).to.equal(2);
        });
    });
});
