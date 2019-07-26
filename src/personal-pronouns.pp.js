import { createWordHighlight } from './dom-construction.js';

const personalPronouns = 
#include "../data/personal-pronouns.json"
;

// Construct the regular expressions.
const esc = (s) => s.replace('/','\/') ;
const escaped = personalPronouns.map(esc);
const regexp = new RegExp('\\b(' + escaped.join('|') + ')\\b', 'i');

// Report whether the text includes a personal pronouns specifier.
export function hasPersonalPronounSpec(text) {
    return regexp.test(text);
}

// Get a string representation of all personal pronouns found in given text.
export function getPersonalPronounSpecs(text) {
    const match = (s) => text.match(new RegExp('\\b'+s+'\\b', 'i'));
    return personalPronouns.filter(match).join(', ');
}

// Highlight all personal pronoun specifiers found in the given text.
export function highlightPersonalPronounSpecs(text) {
    // Note: This does not preserve case!
    let result = text, pp = null;
    for (pp of personalPronouns) {
        const re = new RegExp(pp, 'ig');
        result = result.replace(re, createWordHighlight(pp));
    }
    return result;
}
