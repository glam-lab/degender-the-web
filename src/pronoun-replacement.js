import { createWordReplacement } from './dom-construction.js';

const dictionary = { "she": "they",
                     "her": "them",           
                     // But: 'her book' -> 'their book'
                     "hers": "theirs",
                     "herself": "themself",
                     "he": "they",
                     "him": "them",
                     "his": "their", 
                     // But: 'the book is his' -> 'the book is theirs'
                     "himself": "themself" };

// Capitalize the first letter of the given string
function titleCase(word) {
    return word[0].toUpperCase() + word.slice(1);
}

// Check if text includes any replaceable pronouns.
// Use a closure to preconstruct the regexp.
const hasReplaceablePronouns = (function() {
    // Words must be bounded on both ends ('\b'). Case-insensitive ('i').
    const regexp = new RegExp('\\b('+Object.keys(dictionary).join('|')+')\\b', 
                              'i');
    return (text) => regexp.test(text);
})();

// Find the subtitution for a given word (case-sensitive).
// Use a closure to precompute adding tooltips to replacement text, 
// with title case variants
const substitute = (function () {
    const capitalizers = [ titleCase, 
                           x => x.toLowerCase() ];
    const substitution = {};
    let word = '', f = null;
    for (word in dictionary) {
        for (f of capitalizers) {
            substitution[f(word)] = createWordReplacement(f(dictionary[word]), 
                                                          f(word));
        }
    }
    return (word) => substitution[word]; 
})();

// Replace the pronouns in given text.
function replacePronouns(text) {
    const doc = nlp(text);
    let word = null;
    for (word in dictionary) {
        if (doc.has(word)) {
            // Replace matching words while preserving case.
            // Do not change acronyms.
            const tc = substitute(titleCase(word));
            const lc = substitute(word.toLowerCase());
            const matches = doc.match(word);
            matches.match("#TitleCase").replaceWith(tc);
            matches.not("#TitleCase").not("#Acronym").replaceWith(lc);
        }
    }
    return doc.all().out('text');
}

export { hasReplaceablePronouns, replacePronouns };
