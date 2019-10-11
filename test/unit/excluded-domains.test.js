/*eslint no-unused-expressions: "off" */
/*globals describe, it, chai */
import { excludedDomains } from "../../data/excluded-domains.js";
import { inExcludedDomain } from "../../src/excluded-domains.js";

const domains = Object.keys(excludedDomains);

describe("excluded-domains.js", function() {
    describe("inExcludedDomain", function() {
        it("should be true for any listed domain", function() {
            domains.forEach(function(d) {
                chai.expect(inExcludedDomain(d)).to.be.true;
            });
        });
        it("should be true for any host in a listed domain", function() {
            ["www", "foo"].forEach(function(s) {
                chai.expect(inExcludedDomain(s + "." + domains[0])).to.be.true;
            });
        });
        it("should be true for nested domains", function() {
            chai.expect(inExcludedDomain("foo.bar." + domains[0])).to.be.true;
        });
        it("should be false for hosts in unlisted domains", function() {
            chai.expect(inExcludedDomain("localhost")).to.be.false;
            chai.expect(inExcludedDomain("my.server.name.here")).to.be.false;
        });
        it("should be false if the domain is a superstring", function() {
            chai.expect(inExcludedDomain("www.my" + domains[0])).to.be.false;
        });
    });
});
