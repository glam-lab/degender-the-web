/*globals describe, mocha */
import unit from "../test/unit/index.js";

describe("Unit tests", unit.bind(this));

mocha.checkLeaks();
mocha.run();
