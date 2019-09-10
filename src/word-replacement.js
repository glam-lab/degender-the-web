/*global nlp */

// Capitalize the first letter of the given string.
export function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1);
}

function isCapitalized(word) {
    return word.trim().match(/^[A-Z]/);
}

// Yikes. See spelling rules at
// https://www.really-learn-english.com/spelling-rules-add-s-verb.html
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

    // Question form, e.g., "Does she smoke?" must start with an irregular verb
    irregulars.forEach(function(pair) {
        doc.match("[" + pair[0] + "] " + subject).replace(capitalize(pair[1]));
    });

    // What comes before a verb in a statement that needs fixing
    const subjAdvPat = subject + " #Adverb? ";

    // Rule for verbs ending in y, like "fly"
    const yVerbs = doc
        .match(subjAdvPat + "[_ies]")
        .out("array")
        .map(v => [v, v.slice(0, -3) + "y"]);

    // Rule for verbs ending in o, like "go", or a soft consonant, like "squash"
    const esVerbs = doc
        .match(subjAdvPat + "[_es]")
        .out("array")
        .map(v => [v, v.slice(0, -2)])
        .filter(v => v[1].match(/(o|s|ch|sh|x|z)$/));

    // Rule for regular verbs ending in other letters
    const sVerbs = doc
        .match(subjAdvPat + "[_s]")
        .out("array")
        .map(v => [v, v.slice(0, -1)]);

    // Statement form, e.g., "Yes, she smokes." or "No, she does not smoke."
    irregulars
        .concat(yVerbs)
        .concat(esVerbs)
        .concat(sVerbs)
        .forEach(function(pair) {
            doc.match(subjAdvPat + "[" + pair[0] + "]").replace(pair[1]);
        });
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
            // Deal with verb number following (he|she) -> they.
            if (["he", "she", "he or she"].includes(word)) {
                fixVerbNumber(doc, word);
            }

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
