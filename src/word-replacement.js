/*global nlp */

function replaceWithCapitalization(doc, substitute, word) {
    doc.match(word)
        .not("#Acronym")
        .forEach(function(m) {
            const matchedWord = m
                .clone()
                .setPunctuation("")
                .trim()
                .out("text");
            m.replaceWith(substitute(matchedWord));
        });
}

// Replace the words in given text using the given substitute function.
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
            replaceWithCapitalization(doc, substitute, word);
        }
    }
    return doc.all().out("text");
}
