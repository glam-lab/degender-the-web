/*globals describe, it, chai */
import {
    appStyleClass,
    highlight,
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
        it("should use the application style class", function() {
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
        it("should use the application style class", function() {
            expectStyleClass(result, appStyleClass);
        });
        it("should contain the text to insert", function() {
            expectElementContents(result, "spam");
        });
    });

    describe("highlight", function() {
        const result = highlight("spam");
        it("should construct text representing a strong element", function() {
            expectElementType(result, "strong");
        });
        it("should use the application style class", function() {
            expectStyleClass(result, appStyleClass);
        });
        it("should contain the word to highlight", function() {
            expectElementContents(result, "spam");
        });
    });
});
