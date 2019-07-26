const personalPronouns = 
#include "../data/personal-pronouns.json"
;

// Construct the regular expression.
const escapedPronouns = personalPronouns.map((s) => s.replace('/','\/'));
const regexp = new RegExp('\\b(' + escapedPronouns.join('|') + ')\\b');

// Report whether the text includes a personal pronouns specifier.
export function hasPersonalPronounSpec(text) {
    return regexp.test(text);
}
