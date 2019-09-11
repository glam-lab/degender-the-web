/*globals describe, it, chai */
import {
    createWordHighlight,
    highlightClass
} from "../../src/dom-construction.js";

function expectSpanElement(text) {
    chai.expect(text).to.match(/^<span.*span>$/i);
}

function expectStyleClass(text, className) {
    chai.expect(text).to.match(
        new RegExp("class=(\"|')" + className + "(\"|')", "i")
    );
}

function expectElementContents(text, contents) {
    chai.expect(text).to.match(new RegExp(">" + contents + "<"));
}

describe("dom-construction.js", function() {
    describe("createWordHighlight", function() {
        const result = createWordHighlight("spam");
        it("should construct text representing a span element", function() {
            expectSpanElement(result);
        });
        it("should use the specified highlight class", function() {
            expectStyleClass(result, highlightClass);
        });
        it("should contain the word to highlight", function() {
            expectElementContents(result, "spam");
        });
    });
});
