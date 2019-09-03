/*globals describe, it, chai */
import {
    createWordHighlight,
    highlightClass
} from "../../src/dom-construction.js";
import {
    createWordReplacement,
    replacementClass
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

export default function suite() {
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
    describe("createWordReplacement", function() {
        const result = createWordReplacement("goodbye", "hello");
        it("should construct text representing a span element", function() {
            expectSpanElement(result);
        });
        it("should use the specified replacement class", function() {
            expectStyleClass(result, replacementClass);
        });
        it("should contain the new word", function() {
            expectElementContents(result, "goodbye");
        });
        it("should specify a mouseover function", function() {
            chai.expect(result).to.match(
                /onmouseover="this.innerHTML='hello';"/i
            );
        });
        it("should specify a mouseout function", function() {
            chai.expect(result).to.match(
                /onmouseout="this.innerHTML='goodbye';"/i
            );
        });
    });
}
