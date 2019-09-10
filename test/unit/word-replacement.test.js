/*eslint no-unused-expressions: "off" */
/*globals describe, it, chai */
import {
    capitalize,
    isCapitalized,
    replaceWords
} from "../../src/word-replacement.js";

describe("word-replacement.js", function() {
    describe("capitalize", function() {
        it("should capitalize the first letter of the given string", function() {
            chai.expect(capitalize("hello")).to.equal("Hello");
        });
    });

    describe("isCapitalized", function() {
        it("should be true for 'J. Random Hacker'", function() {
            chai.expect(isCapitalized("J. Random Hacker")).to.be.true;
        });
        it("should be false for 'spam'", function() {
            chai.expect(isCapitalized("spam")).to.be.false;
        });
    });

    describe("replaceWords", function() {
        const words = ["hello", "foo"];
        const dictionary = {
            hello: "goodbye",
            Hello: "Goodbye",
            foo: "bar",
            Foo: "Bar"
        };
        function substitute(word) {
            return dictionary[word];
        }
        function myReplaceWords(str) {
            return replaceWords(str, words, substitute);
        }
        it("should not change a string that does not include any of the given words", function() {
            const str = "so long, adieu, auf wiedersehen, goodbye";
            chai.expect(myReplaceWords(str)).to.equal(str);
        });
        it("should replace a word at the beginning of a string", function() {
            chai.expect(myReplaceWords("hello world")).to.equal(
                "goodbye world"
            );
        });
        it("should replace a word in the middle of a string", function() {
            chai.expect(myReplaceWords("well hello world")).to.equal(
                "well goodbye world"
            );
        });
        it("should replace a word at the end of a string", function() {
            chai.expect(myReplaceWords("hi hello")).to.equal("hi goodbye");
        });
        it("should only replace words in the words list", function() {
            chai.expect(
                replaceWords("hello foo", ["hello"], substitute)
            ).to.equal("goodbye foo");
        });
        it("should replace multiple words", function() {
            chai.expect(myReplaceWords("hello foo")).to.equal("goodbye bar");
        });
        it("should replace multiple instances of a word", function() {
            chai.expect(myReplaceWords("hello hello hello")).to.equal(
                "goodbye goodbye goodbye"
            );
        });
        it("should preserve case", function() {
            chai.expect(myReplaceWords("Hello world")).to.equal(
                "Goodbye world"
            );
        });
        it("should replace a word preceded by .", function() {
            chai.expect(myReplaceWords("Well. Hello world!")).to.equal(
                "Well. Goodbye world!"
            );
        });
        it.skip("should replace a word preceded/followed by ?", function() {
            // Pending improvements to compromise
            chai.expect(myReplaceWords("Hello? Hello world!")).to.equal(
                "Goodbye? Goodbye world!"
            );
        });
        it("should replace a word preceded/followed by !", function() {
            chai.expect(myReplaceWords("Well! Hello foo!")).to.equal(
                "Well! Goodbye bar!"
            );
        });
        it("should replace a word preceded by ,", function() {
            chai.expect(myReplaceWords("Well, hello world!")).to.equal(
                "Well, goodbye world!"
            );
        });
        it("should replace a word preceded/followed by ;", function() {
            chai.expect(myReplaceWords("Hello; hello world!")).to.equal(
                "Goodbye; goodbye world!"
            );
        });
        it.skip("should replace a word preceded by -", function() {
            // Pending improvements to compromise
            chai.expect(myReplaceWords("Well - hello world!")).to.equal(
                "Well - goodbye world!"
            );
        });
        it("should replace a word followed by -", function() {
            chai.expect(myReplaceWords("Hello - world!")).to.equal(
                "Goodbye - world!"
            );
        });
        it.skip("should replace a word preceded/followed by []", function() {
            // Pending improvements to compromise
            chai.expect(myReplaceWords("[hello foo]")).to.equal(
                "[goodbye bar]"
            );
        });
        it.skip("should replace a word preceded/followed by ()", function() {
            // Pending improvements to compromise
            chai.expect(myReplaceWords("(hello foo)")).to.equal(
                "(goodbye bar)"
            );
        });
    });
});
