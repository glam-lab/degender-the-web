/*globals nlp */
import {
    compoundPronouns,
    genderPronouns,
    allPronouns
} from "../data/pronouns.js";
import { capitalize, isCapitalized } from "./capitalization.js";
import { replaceWords } from "./word-replacement.js";
import { pluralizeVerbs } from "./verb-pluralization.js";

// Check if text includes any replaceable pronouns.
// Words must be bounded on both ends ('\b'). Case-insensitive ('i').
const regexp = new RegExp(
    "\\b(" + Object.keys(allPronouns).join("|") + ")\\b",
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

// Fix up possessive adjectives:
// "her book" -> "them book" -> "their book"
// "his book" -> "theirs book" -> "their book"
function replacePossessiveAdjectives(text) {
    // Spencer and I disagree about whether a semicolon or a dash is equivalent
    // to a period. So we're going to force the issue.
    if (text.includes(";")) {
        return text
            .split(";")
            .map(t => replacePossessiveAdjectives(t))
            .join("; ")
            .replace(/ +/g, " ");
    }
    if (text.match(/ -+ /)) {
        return text
            .split(/ -+ /)
            .map(t => replacePossessiveAdjectives(t))
            .join(" - ")
            .replace(/ +/g, " ");
    }

    const doc = nlp(text);
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
    return doc.all().out("text");
}

// Replace the pronouns in given text, expanding contractions.
// If compound pronouns are found, do not look for singular gender pronouns.
export function replacePronouns(text) {
    let result = replaceWords(
        text,
        Object.keys(compoundPronouns),
        substitute,
        false
    );
    result = replacePossessiveAdjectives(result);
    result = replaceWords(
        result,
        Object.keys(genderPronouns),
        substitute,
        true
    );
    result = pluralizeVerbs(result);
    return result;
}
