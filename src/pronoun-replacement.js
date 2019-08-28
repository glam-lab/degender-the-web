import { createWordReplacement } from "./dom-construction.js";
import { titleCase, replaceWords } from "./word-replacement.js";

const compound = {
    // Compound pronouns first!
    "he or she": "they",
    "him or her": "them",
    "his or her": "their",
    "his or hers": "theirs",
    "himself or herself": "themself"
};

const singular = {
    // She/her/her/hers/herself
    she: "they",
    her: "them",
    // But: 'her book' -> 'their book'
    hers: "theirs",
    herself: "themself",
    // He/him/his/his/himself
    he: "they",
    him: "them",
    his: "their",
    // But: 'the book is his' -> 'the book is theirs'
    himself: "themself"
};
const dictionary = { ...compound, ...singular }; // This is called object spread

// Check if text includes any replaceable pronouns.
// Use a closure to preconstruct the regexp.
const hasReplaceablePronouns = (function() {
    // Words must be bounded on both ends ('\b'). Case-insensitive ('i').
    const regexp = new RegExp(
        "\\b(" + Object.keys(dictionary).join("|") + ")\\b",
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
    for (word in dictionary) {
        for (f of capitalizers) {
            substitution[f(word)] = createWordReplacement(
                f(dictionary[word]),
                f(word)
            );
        }
    }
    return word => substitution[word];
})();

// Replace the pronouns in given text, expanding contractions.
// If compound pronouns are found, do not look for singular pronouns.
function replacePronouns(text) {
    let result = replaceWords(text, Object.keys(compound), substitute, false);
    if (result === text) {
        result = replaceWords(text, Object.keys(singular), substitute, true);
    }
    return result;
}

export { hasReplaceablePronouns, replacePronouns };
