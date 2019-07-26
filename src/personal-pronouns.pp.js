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
