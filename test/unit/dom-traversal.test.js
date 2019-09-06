/*eslint no-unused-expressions: "off" */
/*globals describe, it, after, chai */
import {
    textNodesUnder,
    isEditable,
    isVisible
} from "../../src/dom-traversal.js";

function constructElementWithText(tag) {
    const element = document.createElement(tag);
    element.innerHTML = "blah blah blah";
    return element;
}

function expectEditable(element) {
    chai.expect(textNodesUnder(element).some(isEditable)).to.be.true;
}

function expectNotEditable(element) {
    chai.expect(textNodesUnder(element).some(isEditable)).to.be.false;
}

function expectVisible(element) {
    chai.expect(isVisible(element)).to.be.true;
}

function expectNotVisible(element) {
    chai.expect(isVisible(element)).to.be.false;
}

describe("dom-traversal.js", function() {
    describe("textNodesUnder", function() {
        const element = document.createElement("p");
        element.innerHTML = "foo <span>bar</span> baz";
        const result = textNodesUnder(element);
        it("should return an array", function() {
            chai.expect(result).to.exist;
            chai.expect(result).to.be.an.instanceOf(Array);
        });
        it("should have three elements", function() {
            chai.expect(result.length).to.equal(3);
        });
        it("should contain text nodes", function() {
            chai.expect(result.every(node => node.nodeType === Node.TEXT_NODE))
                .to.be.true;
        });
    });
    describe("isEditable", function() {
        ["textarea", "input", "form"].forEach(function(tag) {
            it("should be true for text in a " + tag, function() {
                const element = constructElementWithText(tag);
                expectEditable(element);
            });
        });
        it("should be true for text in a node with 'edit' in the class name", function() {
            const element = constructElementWithText("div");
            element.classList.add("editable");
            expectEditable(element);
        });
        it("should be true for text in a node with 'edit' in the id", function() {
            const element = constructElementWithText("div");
            element.id = "editor";
            expectEditable(element);
        });
        it("should be false otherwise", function() {
            const element = constructElementWithText("div");
            expectNotEditable(element);
        });
        it("should be false even if the body tag has the class name 'edit'", function() {
            const element = constructElementWithText("div");
            element.id = "testdiv";
            document.body.appendChild(element);
            document.body.classList.add("editable");
            expectNotEditable(element);
        });
        after(function(done) {
            // Clean up changes to the body tag from the final test
            document.body.classList.remove("editable");
            document.body.removeChild(document.getElementById("testdiv"));
            done();
        });
    });
    describe("isVisible", function() {
        it("should be false within an element with display='none'", function() {
            const textNode = document.createTextNode("foobar");
            const parentElement = document.createElement("div");
            parentElement.id = "test-visible-parent-display-none";
            parentElement.appendChild(textNode);
            parentElement.style.display = "none";
            document.body.appendChild(parentElement);
            expectNotVisible(textNode);
        });
        it("it should be false when its grandparent has display='none'", function() {
            const textNode = document.createTextNode("foobar");
            const parentElement = document.createElement("div");
            const ancestorElement = document.createElement("div");
            ancestorElement.id = "test-visible-grandparent-display-none";
            parentElement.appendChild(textNode);
            ancestorElement.appendChild(parentElement);
            ancestorElement.style.display = "none";
            document.body.appendChild(ancestorElement);
            expectNotVisible(textNode);
        });
        it("should be true otherwise", function() {
            const textNode = document.createTextNode("foobar");
            const parentElement = document.createElement("div");
            parentElement.id = "test-visible-normal";
            parentElement.appendChild(textNode);
            parentElement.style.display = "block";
            document.body.appendChild(parentElement);
            expectVisible(textNode);
        });
        after(function(done) {
            document.body.removeChild(
                document.getElementById("test-visible-parent-display-none")
            );
            document.body.removeChild(
                document.getElementById("test-visible-grandparent-display-none")
            );
            document.body.removeChild(
                document.getElementById("test-visible-normal")
            );
            done();
        });
    });
});
