/*globals describe */
import dc from "./dom-construction.test.js";
import dt from "./dom-traversal.test.js";
import ed from "./excluded-domains.test.js";
import pr from "./pronoun-replacement.test.js";
import sh from "./stopword-highlights.test.js";
import wr from "./word-replacement.test.js";

export default function suite() {
    describe("dom-construction", dc.bind(this));
    describe("dom-traversal", dt.bind(this));
    describe("excluded-domains", ed.bind(this));
    describe("pronoun-replacements", pr.bind(this));
    describe("stopword-highlights", sh.bind(this));
    describe("word-replacement", wr.bind(this));
}
