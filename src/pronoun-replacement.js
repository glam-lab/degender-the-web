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

// This is a functor because substitute functions get called a lot!
function makeSubstituter(dictionary) {
    return function(word) {
        let result = dictionary[word.toLowerCase()];
        if (isCapitalized(word)) {
            result = capitalize(result);
        }
        return result;
    };
}

const substitutePronoun = makeSubstituter(allPronouns);

const irregularVerbs = [
    ["is", "are"],
    ["was", "were"],
    ["has", "have"],
    ["does", "do"]
];
const substituteIrregularVerb = makeSubstituter(
    irregularVerbs.reduce(function(obj, entry) {
        obj[entry[0]] = entry[1];
        return obj;
    }, {})
);

// Replace nlp matches, keeping the capitalization from the original text.
export function replaceMatchWithCapitalization(matches, substitute, postfix) {
    postfix = postfix ? postfix : "";
    matches.not("#Acronym").forEach(function(m) {
        // Get the matched word with capitalization but without punctuation
        const matchedWord = m
            .clone()
            .out("text")
            .match(/\w+/)[0];

        // Find the replacement word
        let replacement = substitute(matchedWord + postfix);

        // Restore parentheses (ugh, really?)
        const tags = m.out("tags")[0].tags;
        if (tags.includes("EndBracket")) {
            replacement += ")";
        }
        if (tags.includes("StartBracket")) {
            replacement = "(" + replacement;
        }

        // Replace the matched word
        m.replaceWith(replacement);
    });
}

// Pluralize verbs that "they" perform.
// Expects a tagged document, with contractions expanded.
export function pluralizeVerbs(doc) {
    const subjAdvPat = "they #Adverb? ";

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
    // Note we don't need to worry about capitalization, because the verb
    // can never lead the sentence.
    irregularVerbs
        .concat(yVerbs)
        .concat(esVerbs)
        .concat(sVerbs)
        .forEach(function(pair) {
            doc.match(subjAdvPat + "[" + pair[0] + "]").replaceWith(pair[1]);
        });

    // Question form, e.g., "Does she smoke?" or "Will not she go?"
    // Here we do need to worry about capitalization: "Well, does she smoke?"
    irregularVerbs.forEach(function(pair) {
        const matches = doc.match("[" + capitalize(pair[0]) + "] not? they");
        replaceMatchWithCapitalization(matches, substituteIrregularVerb, "");
    });

    // "Have not they a book?" -> "Have they not a book?"
    doc.match("not they").replaceWith("they not");

    return doc.all();
}

// Replace "he" and "she" only.
// Expects a tagged document, with contractions expanded.
export function replaceHeShe(doc) {
    ["she", "he"].forEach(function(pronoun) {
        const matches = doc.match(pronoun);
        replaceMatchWithCapitalization(matches, substitutePronoun, "");
    });
    return doc.all();
}

// Replace possessive adjectives:
//   "her book" -> "their book"
//   "his book" -> "their book"
// Expects a tagged document, not plain text!
export function replacePossessiveAdjectives(doc) {
    ["her", "his"].forEach(function(pronoun) {
        const matches = doc.match(
            "[" + pronoun + "] #Ordinal? #Adjective? #Noun"
        );
        replaceMatchWithCapitalization(matches, substitutePronoun, "_poss_adj");
    });
    return doc.all();
}

// Ensures there is a space after every period,
// unless there is a following quotation mark.
// This has been a problem with Compromise output.
export function spaceAfterPeriod(text) {
    text = text.replace(/\./g, ". ");
    text = text.replace(/ +/g, " ");
    text = text.replace(/. "/g, '."');
    text = text.replace(/. ”/g, ".”");
    return text;
}

// Replace the pronouns in given text.

// Algorithm steps:
// 0. Deal with punctuation that Compromise doesn't handle as we'd like.
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
            .map(t => replacePronouns(t, showChanges))
            .join("; ")
            .replace(/ +/g, " ");
    }
    if (text.match(/ -+ /)) {
        return text
            .split(/ -+ /)
            .map(t => replacePronouns(t, showChanges))
            .join(" - ")
            .replace(/ +/g, " ");
    }

    // Step 0, continued.
    // Spans sometimes start with a leading period, which seems to mess up nlp.
    if (text[0] === ".") {
        return "." + replacePronouns(text.slice(1), showChanges);
    }

    // Now we start the algorithm proper.
    let result = text;

    // Step 1
    result = replaceWords(
        result,
        Object.keys(compoundPronouns),
        substitutePronoun
    );

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
    result = replaceWords(
        result,
        Object.keys(genderPronouns),
        substitutePronoun
    );

    // Step 7
    if (showChanges) {
        result = diffString(text, result);
    }

    return result;
}
