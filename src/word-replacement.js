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

export { dictionary, titleCase, substitute };
