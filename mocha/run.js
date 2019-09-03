/*globals mocha */
import "../test/unit/all.js";

mocha.checkLeaks();
mocha.run();
