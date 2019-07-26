import { personalPronounSpecs } from './personal-pronoun-specs.js'
import { createWordHighlight } from './dom-construction.js';

// Construct the regular expressions.
const esc = (s) => s.replace('/','\/') ;
const escaped = personalPronounSpecs.map(esc);
const regexp = new RegExp('\\b(' + escaped.join('|') + ')\\b', 'i');

// Report whether the text includes a personal pronouns specifier.
export function hasPersonalPronounSpec(text) {
    return regexp.test(text);
}

// Get a string representation of all personal pronouns found in given text.
export function getPersonalPronounSpecs(text) {
    const match = (s) => text.match(new RegExp('\\b'+s+'\\b', 'i'));
    return personalPronounSpecs.filter(match).join(', ');
}

// Highlight all personal pronoun specifiers found in the given text.
export function highlightPersonalPronounSpecs(text) {
    // Note: This does not preserve case!
    let result = text, pp = null;
    for (pp of personalPronounSpecs) {
        const re = new RegExp(pp, 'ig');
        result = result.replace(re, createWordHighlight(pp));
    }
    return result;
}

