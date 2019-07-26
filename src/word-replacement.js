// Capitalize the first letter of the given string.
export function titleCase(word) {
    return word[0].toUpperCase() + word.slice(1);
}

// Replace the words in given text using the given substitute function.
// Preserve title and lower case, ignoring ACRONYMS.
export function replaceWords(text, words, substitute) {
    const doc = nlp(text);
    let word = null;
    for (word of words) {
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
