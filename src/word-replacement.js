/*global nlp */

// Capitalize the first letter of the given string.
export function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1);
}

// Yikes.
function fixVerbNumber(doc, subject) {
    const irregulars = [
        ["is not", "are not"],
        ["is", "are"],
        ["was not", "were not"],
        ["was", "were"],
        ["has not", "have not"],
        ["has", "have"],
        ["does not", "do not"],
        ["does", "do"]
    ];
    const esVerbs = doc
        .match(subject + " #Adverb? [_es]")
        .out("array")
        .map(v => [v, v.slice(0, -2)]);
    const sVerbs = doc
        .match(subject + " #Adverb? [_s]")
        .out("array")
        .map(v => [v, v.slice(0, -1)]);
    // Question form, e.g., "Does she smoke?"
    irregulars.forEach(function(pair) {
        doc.match("[" + pair[0] + "] " + subject).replace(capitalize(pair[1]));
    });
    // Statement form, e.g., "Yes, she smokes." or "No, she does not smoke."
    irregulars
        .concat(esVerbs)
        .concat(sVerbs)
        .forEach(function(pair) {
            doc.match(subject + " #Adverb? [" + pair[0] + "]").replace(pair[1]);
        });
}

// Replace the words in given text using the given substitute function.
// Preserve title and lower case, ignoring ACRONYMS.
// An option is given to expand contractions.
export function replaceWords(
    text,
    words,
    substitute,
    expandContractions = false
) {
    const doc = nlp(text);
    if (expandContractions) {
        doc.contractions().expand();
    }
    let word = null;
    for (word of words) {
        if (doc.has(word)) {
            // Deal with verb number following (he|she) -> they.
            if (["he", "she", "he or she"].includes(word)) {
                fixVerbNumber(doc, word);
            }
            // Replace matching words while preserving case.
            // Do not change acronyms.
            const tc = substitute(capitalize(word));
            const lc = substitute(word.toLowerCase());
            const matches = doc.match(word);
            matches.not("#Acronym").forEach(function(m) {
                if (
                    m
                        .out("text")
                        .trim()
                        .match(/^[A-Z]/)
                ) {
                    m.replaceWith(tc);
                } else {
                    m.replaceWith(lc);
                }
            });
        }
    }
    return doc.all().out("text");
}
