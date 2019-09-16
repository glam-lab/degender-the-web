import { capitalize } from "./capitalization.js";

const regexps = new Object();

export function getRegExp(words) {
    if (!(words in regexps)) {
        const pattern = words
            .map(w => "[" + capitalize(w[0]) + w[0] + "]" + w.slice(1))
            .join("|");
        regexps[words] = new RegExp("\\b(" + pattern + ")\\b", "g");
    }
    return regexps[words];
}

// Replace the words in given text using the given substitute function.
// An option is given to expand contractions.
export function replaceWords(text, words, substitute) {
    return text.replace(getRegExp(words), substitute);
}
