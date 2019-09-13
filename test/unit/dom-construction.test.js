/*globals describe, it, chai */
import {
    appStyleClass,
    createWordHighlight,
    highlightClass,
    ins,
    del
} from "../../src/dom-construction.js";

function expectElementType(text, type) {
    chai.expect(text).to.match(
        new RegExp("^<" + type + ".*>.*</" + type + ">$", "i")
    );
}

function expectStyleClass(text, className) {
    chai.expect(text).to.match(
        new RegExp("class=(\"|').*\\b" + className + "\\b.*(\"|')", "i")
    );
}

function expectElementContents(text, contents) {
    chai.expect(text).to.match(new RegExp(">" + contents + "<"));
}

describe("dom-construction.js", function() {

    describe("ins", function() {
        const result = ins("spam");
        it("should construct text representing an ins element", function() {
            expectElementType(result, "ins");
        });
        it("should use the dgtw class", function() {
            expectStyleClass(result, appStyleClass);
        });
        it("should contain the text to insert", function() {
            expectElementContents(result, "spam");
        });
    });

    describe("del", function() {
        const result = del("spam");
        it("should construct text representing a del element", function() {
            expectElementType(result, "del");
        });
        it("should use the dgtw class", function() {
            expectStyleClass(result, appStyleClass);
        });
        it("should contain the text to insert", function() {
            expectElementContents(result, "spam");
        });
    });

    describe("highlight", function() {
        const result = createWordHighlight("spam");
        it("should construct text representing a span element", function() {
            expectElementType(result, "span");
        });
        it("should use the specified highlight class", function() {
            expectStyleClass(result, highlightClass);
        });
        it("should contain the word to highlight", function() {
            expectElementContents(result, "spam");
        });
    });
});
