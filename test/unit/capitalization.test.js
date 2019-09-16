/*eslint no-unused-expressions: "off" */
/*globals describe, it, chai */
import { capitalize, isCapitalized } from "../../src/capitalization.js";

describe("capitalization.js", function() {
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
});
