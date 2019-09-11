/*globals nlp */
import {
    compoundPronouns,
    genderPronouns,
    allPronouns
} from "../data/pronouns.js";
import { capitalize, isCapitalized } from "./capitalization.js";
import { replaceWords } from "./word-replacement.js";
import { diffString } from "./diff.js";

// Check if text includes any replaceable pronouns.
// Words must be bounded on both ends ('\b'). Case-insensitive ('i').
const regexp = new RegExp(
    "\\b(" + Object.keys(genderPronouns).join("|") + ")\\b",
    "i"
);
export function hasReplaceablePronouns(text) {
    return regexp.test(text);
}

// The substitute function provides the replacement for a given pronoun.
function substitute(pronoun) {
    let result = allPronouns[pronoun.toLowerCase()];
    if (isCapitalized(pronoun)) {
        result = capitalize(result);
    }
    return result;
}

// Pluralize verbs that "they" perform.
// Expects a tagged document, not plain text!
export function pluralizeVerbs(doc) {
    // What comes before a verb in a statement that needs fixing
    const subjAdvPat = "they #Adverb? ";

    const irregulars = [
        ["is", "are"],
        ["was", "were"],
        ["has", "have"],
        ["does", "do"]
    ];

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
            doc.match(subjAdvPat + "[" + pair[0] + "]").replaceWith(pair[1]);
        });

    // Question form, e.g., "Does she smoke?" or "Won't she go?"
    irregulars.forEach(function(pair) {
        doc.match("[" + capitalize(pair[0]) + "] not? they").replaceWith(
            capitalize(pair[1])
        );
    });

    // "Have not they a book?" -> "Have they not a book?"
    doc.match("not they").replaceWith("they not");

    return doc.all();
}

// Replace "he" and "she" only.
// Expects a tagged document, not plain text!
export function replaceHeShe(doc) {
    ["she", "he"].forEach(function(pronoun) {
        doc.match(pronoun)
            .not("#Acronym")
            .forEach(function(m) {
                const matchedWord = m
                    .clone()
                    .setPunctuation("")
                    .trim()
                    .out("text");
                m.replaceWith(
                    isCapitalized(matchedWord)
                        ? substitute(capitalize(pronoun))
                        : substitute(pronoun)
                );
            });
    });

    return doc.all();
}

// Replace possessive adjectives:
//   "her book" -> "their book"
//   "his book" -> "their book"
// Expects a tagged document, not plain text!
export function replacePossessiveAdjectives(doc) {
    ["her", "his"].forEach(function(pronoun) {
        doc.match("[" + pronoun + "] #Noun")
            .not("#Acronym")
            .forEach(function(m) {
                const matchedWord = m
                    .clone()
                    .setPunctuation("")
                    .trim()
                    .out("text");
                m.replaceWith(
                    isCapitalized(matchedWord)
                        ? substitute(capitalize(pronoun) + "_poss_adj")
                        : substitute(pronoun + "_poss_adj")
                );
            });
    });

    return doc.all();
}

// Ensures there is a space after every period.
// This has been a problem with Compromise output.
export function spaceAfterPeriod(text) {
    return text.replace(/\./g, ". ").replace(/ +/g, " ");
}

// Replace the pronouns in given text.

// Algorithm steps:
// 0. Break on semicolon and dash (similar to a period)
// 1. Replace compound pronouns.
// 2. Expand relevant contractions.
// 3. Replace subject "he" and "she" with "they"
// 4. Pluralize verbs associated with "they"
// 5. Replace possessive adjectives ("her book" or "his book" -> "their book").
// 6. Replace all other gender pronouns.
// 7. If requested, show changes.
// This order of steps is chosen for correctness and efficiency.
// It keeps together steps that require NLP, so the text is tagged only once.

export function replacePronouns(text, showChanges) {
    // Step 0. Spencer and I disagree about whether a semicolon or a dash is
    // equivalent to a period. So we're going to force the issue.
    // Use recursive calls for simplicity's sake.
    if (text.includes(";")) {
        return text
            .split(";")
            .map(t => replacePronouns(t))
            .join("; ")
            .replace(/ +/g, " ");
    }
    if (text.match(/ -+ /)) {
        return text
            .split(/ -+ /)
            .map(t => replacePronouns(t))
            .join(" - ")
            .replace(/ +/g, " ");
    }

    // Now we start the algorithm proper.
    let result = text;

    // Step 1
    result = replaceWords(result, Object.keys(compoundPronouns), substitute);

    // Steps 2-5 (require NLP)
    let doc = nlp(result);
    doc = doc
        .contractions()
        .expand()
        .all();
    doc = replaceHeShe(doc);
    doc = pluralizeVerbs(doc);
    doc = replacePossessiveAdjectives(doc);
    result = doc.all().out("text");
    result = spaceAfterPeriod(result);

    // Step 6
    result = replaceWords(result, Object.keys(genderPronouns), substitute);

    // Step 7
    if (showChanges) {
        result = diffString(text, result);
    }

    return result;
}
