/*global nlp */

// Capitalize the first letter of the given string.
export function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1);
}

// Return true if the given string begins with a capital letter.
export function isCapitalized(word) {
    return /^[A-Z]/.test(word);
}

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

// Replace possessive adjectives, a special case.
function replacePossessiveAdjective(doc, substitute, pronoun) {
    const uc = substitute(capitalize(pronoun) + "_poss_adj");
    const lc = substitute(pronoun + "_poss_adj");
    doc.match("[" + pronoun + "] #Noun")
        .not("#Acronym")
        .forEach(function(m) {
            const matchedWord = m
                .clone()
                .setPunctuation("")
                .trim()
                .out("text");
            m.replaceWith(isCapitalized(matchedWord) ? uc : lc);
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
    // Spencer and I disagree about whether a semicolon or a dash is equivalent
    // to a period. So we're going to force the issue.
    if (text.includes(";")) {
        return text
            .split(";")
            .map(t => replaceWords(t, words, substitute, expandContractions))
            .join("; ")
            .replace(/ +/g, " ");
    }
    if (text.match(/ -+ /)) {
        return text
            .split(/ -+ /)
            .map(t => replaceWords(t, words, substitute, expandContractions))
            .join(" - ")
            .replace(/ +/g, " ");
    }

    const doc = nlp(text);
    if (expandContractions) {
        doc.contractions().expand();
    }
    let word = null;
    for (word of words) {
        if (doc.has(word)) {
            if (word === "her") {
                // First, "her #Noun" -> "their #Noun"
                replacePossessiveAdjective(doc, substitute, "her");
                // Otherwise, "her" -> "them"
            } else if (word === "his") {
                // First, "his #Noun" -> "their #Noun"
                replacePossessiveAdjective(doc, substitute, "his");
                // Otherwise "his" -> "theirs"
            }
            replaceWithCapitalization(doc, substitute, word);
        }
    }
    return doc.all().out("text");
}
