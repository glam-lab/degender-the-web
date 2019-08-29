import {
    compoundPronouns,
    genderPronouns,
    allPronouns
} from "../data/pronouns.js";
import { createWordReplacement } from "./dom-construction.js";
import { titleCase, replaceWords } from "./word-replacement.js";

// Check if text includes any replaceable pronouns.
// Use a closure to preconstruct the regexp.
const hasReplaceablePronouns = (function() {
    // Words must be bounded on both ends ('\b'). Case-insensitive ('i').
    const regexp = new RegExp(
        "\\b(" + Object.keys(allPronouns).join("|") + ")\\b",
        "i"
    );
    return text => regexp.test(text);
})();

// The substitute function provides the replacement for a given word.
// Substitution is performed with a dictionary constructed in a closure.
// We provide a function, rather than providing the dictionary directly,
// to protect the dictionary from accidental changes by its users.
const substitute = (function() {
    const capitalizers = [titleCase, x => x.toLowerCase()];
    const substitution = {};
    let word = "",
        f = null;
    for (word in allPronouns) {
        for (f of capitalizers) {
            substitution[f(word)] = createWordReplacement(
                f(allPronouns[word]),
                f(word)
            );
        }
    }
    return word => substitution[word];
})();

// Replace the pronouns in given text, expanding contractions.
// If compound pronouns are found, do not look for singular gender pronouns.
function replacePronouns(text) {
    let result = replaceWords(
        text,
        Object.keys(compoundPronouns),
        substitute,
        false
    );
    if (result === text) {
        result = replaceWords(
            text,
            Object.keys(genderPronouns),
            substitute,
            true
        );
    }
    return result;
}

export { hasReplaceablePronouns, replacePronouns };
