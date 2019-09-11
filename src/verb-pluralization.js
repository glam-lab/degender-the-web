/*global nlp */
import { capitalize } from "./word-replacement.js";

const irregulars = [
    //["is not", "are not"],
    ["is", "are"],
    //["was not", "were not"],
    ["was", "were"],
    //["has not", "have not"],
    ["has", "have"],
    //["does not", "do not"],
    ["does", "do"]
];

// Pluralize verbs that "they" perform
export function pluralizeVerbs(text) {
    const doc = nlp(text);
    doc.contractions().expand();

    // What comes before a verb in a statement that needs fixing
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
    irregulars
        .concat(yVerbs)
        .concat(esVerbs)
        .concat(sVerbs)
        .forEach(function(pair) {
            doc.match(subjAdvPat + "[" + pair[0] + "]").replace(pair[1]);
        });

    // Question form, e.g., "Does she smoke?", must start with an irregular verb
    irregulars.forEach(function(pair) {
        doc.match("[" + pair[0] + "] they").replace(capitalize(pair[1]));
        //doc.match(pair[0] + " not they").replace(capitalize(pair[1]) + " they not");
    });

    return doc.all().out("text");
}
