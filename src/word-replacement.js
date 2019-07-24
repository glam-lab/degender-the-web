import { createWordReplacement } from './dom-construction.js';

let dictionary = { "she": "they",
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

// Find the subtitution for a given word (case-sensitive).
// Use a closure to precompute adding tooltips to replacement text, 
// with title case variants
let substitute = (function () {
    let capitalizers = [ titleCase, 
                         str => str.toUpperCase(), 
                         x => x.toLowerCase() ];
    let substitution = {}, word = '', f = null;
    for (word in dictionary) {
        for (f of capitalizers) {
            substitution[f(word)] = createWordReplacement(f(dictionary[word]), 
                                                          f(word));
        }
    }
    return function(word) { return substitution[word]; }
})();

// Replace the pronouns in given text.
function replacePronouns(text) {
    let doc = nlp(text), word = null;
    for (word in dictionary) {
        if (doc.has(word)) {
             // Replace matching words while preserving case.
            let tc = substitute(titleCase(word));
            let uc = substitute(word.toUpperCase());
            let lc = substitute(word.toLowerCase());
            let matches = doc.match(word);
            matches.match("#TitleCase").replaceWith(tc);
            matches.match("#Acronym").replaceWith(uc);
            matches.not("#TitleCase").not("#Acronym").replaceWith(lc);
        }
    }
    return doc.all().out('text');
}

export { dictionary, replacePronouns };
