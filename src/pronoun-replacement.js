import {
    compoundPronouns,
    genderPronouns,
    allPronouns
} from "../data/pronouns.js";
import { capitalize, isCapitalized, replaceWords } from "./word-replacement.js";

// Check if text includes any replaceable pronouns.
// Words must be bounded on both ends ('\b'). Case-insensitive ('i').
const regexp = new RegExp(
    "\\b(" + Object.keys(allPronouns).join("|") + ")\\b",
    "i"
);
function hasReplaceablePronouns(text) {
    return regexp.test(text);
}

// The substitute function provides the replacement for a given pronoun.
function substitute(pronoun) {
    let result = allPronouns[pronoun.toLowerCase()];
    if (isCapitalized(pronoun)) {
        result = capitalize(result);
    }
    return result;
}

// Replace the pronouns in given text, expanding contractions.
// If compound pronouns are found, do not look for singular gender pronouns.
function replacePronouns(text) {
    let result = replaceWords(
        text,
        Object.keys(compoundPronouns),
        substitute,
        false
    );
    result = replaceWords(
        result,
        Object.keys(genderPronouns),
        substitute,
        true
    );
    return result;
}

export { hasReplaceablePronouns, replacePronouns };
