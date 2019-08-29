/*eslint no-useless-escape: "off"*/

import { personalPronounSpecs } from "../data/personal-pronoun-specs.js";
import { createWordHighlight } from "./dom-construction.js";
import { titleCase } from "./word-replacement.js";

// Construct the regular expressions.
// Escape the slash and allow whitespace characters around it.
const esc = s => s.replace("/", "s*/s*");
const escaped = personalPronounSpecs.map(esc);
const regexp = new RegExp("\\b(" + escaped.join("|") + ")\\b", "i");

// Report whether the text includes the keyword "gender".
// (May be part of another word.)
export function mentionsGender(text) {
    return text.match(/gender/i) ? true : false;
}

// Highlight all instances of the keyword "gender" found in the given text.
// (May be part of another word.)
export function highlightGender(text) {
    function highlightWithCase(text, word) {
        const re = new RegExp(word, "g");
        return text.replace(re, createWordHighlight(word));
    }
    let result = text;
    result = highlightWithCase(result, "gender");
    result = highlightWithCase(result, "Gender");
    result = highlightWithCase(result, "GENDER");
    return result;
}

// Report whether the text includes a personal pronouns specifier.
export function hasPersonalPronounSpec(text) {
    return regexp.test(text);
}

// Get a string representation of all personal pronouns found in given text.
export function getPersonalPronounSpecs(text) {
    const match = s => text.match(new RegExp("\\b" + esc(s) + "\\b", "i"));
    return personalPronounSpecs.filter(match).join(", ");
}

// Highlight all personal pronoun specifiers found in the given text.
export function highlightPersonalPronounSpecs(text) {
    function highlightWithCase(text, word) {
        const re = new RegExp("\\b" + esc(word) + "\\b", "g");
        return text.replace(re, createWordHighlight(word));
    }
    let result = text,
        pp = null;
    for (pp of personalPronounSpecs) {
        result = highlightWithCase(result, pp);
        result = highlightWithCase(result, titleCase(pp));
    }
    return result;
}
