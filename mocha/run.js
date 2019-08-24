/*globals mocha */
import "../test/dom-construction.test.js";
import "../test/dom-traversal.test.js";
import "../test/excluded-domains.test.js";
import "../test/pronoun-replacement.test.js";
import "../test/stopword-highlights.test.js";
import "../test/word-replacement.test.js";

mocha.checkLeaks();
mocha.run();
