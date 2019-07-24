import { inExcludedDomain, whyExcluded } from './excluded-domains.js';
import { dictionary, titleCase } from './replacement.js';
import { createWordReplacement, createHeader, createButton } 
       from './construction.js';
import { textNodesUnder, isEditable } from './traversal.js';

// Preprocess adding tooltips to replacement text, with title case variants
let substitute = {};
let capitalizers = [ titleCase, str => str.toUpperCase(), x => x.toLowerCase() ];
let word = '', f = null;
for (word in dictionary) {
    for (f of capitalizers) {
        substitute[f(word)] = createWordReplacement(f(dictionary[word]), 
                                                    f(word));
    }
}

// Construct a regex to quickly tell if a text node contains any keywords.
let regexp = new RegExp(Object.keys(dictionary).join('|'), "i");

// The core algorithm: If a text node contains one or more keywords, 
// create new nodes containing the substitute text and the surrounding text.
// We collect all nodes in a list before processing them because modification 
// in place seems to disrupt the TreeWalker traversal.
function replacePronounsInBody() {
    let textNodes = textNodesUnder(document.body);
    let node = null;
    for (node of textNodes) {
        let originalText = node.nodeValue;
    
        // Apply NLP only if the original text contains at least one keyword
        // and the node is not part of a form or other editable component.
        if (regexp.test(originalText) && !(isEditable(node))) {
            let doc = nlp(originalText);
            for (word in dictionary) {
                if (doc.has(word)) {
                    // Replace matching words while preserving text.
                    let matches = doc.match(word);
                    matches.match("#TitleCase").replaceWith(substitute[titleCase(word)]);
                    matches.match("#Acronym").replaceWith(substitute[word.toUpperCase()]);
                    matches.not("#TitleCase").not("#Acronym").replaceWith(substitute[word]);
                }
            }
            
            // Glean and insert the replacement text.
            let text = doc.all().out('text');
            let element = document.createElement("span");
            element.innerHTML = text;
            node.parentNode.replaceChild(element, node);
        }
    }
    
    // Fix the width of all "replacement" spans so the text does not reflow
    // when the node content is replaced. 
    // (This relies on the observation than "they/them/their" is longer than
    // "he/him/his" or "she/her/her".)
    let replacementNodes = document.getElementsByClassName("replacement");
    for (node of replacementNodes) {
        let width = node.offsetWidth;    // Find the node's width as rendered.
        node.style.width = width + "px"; // Set the width explicitly in its style.
    }

}

// If this is not an excluded domain, replace the pronouns!
export function main() {
    let restoreOriginalContent = (function() {
        let originalContent = document.body.innerHTML;
        return function() {
            document.body.innerHTML = originalContent;
        };
    })();

    let message = '<i>Degender the Web</i> ';
    let changed = false;

    if (inExcludedDomain(location)) {
        let domain = inExcludedDomain(location);
        message += ' does not run on ' + domain + 
                   ' due to ' + whyExcluded(domain) + '.';
    } else {
        replacePronounsInBody(); 
        changed = document.body.innerHTML.includes('class="dgtw-replacement"'); 
        if (changed) {
            message += ' has replaced gendered pronouns on this page.';
        } else {
            message += ' found no gendered pronouns in static content ' +
                       ' on this page.';
       }
    }

    let header = createHeader(message);
    let dismissHeader = (function(element) {
                            return function() {
                                element.style.display = 'none';
                            };
                        })(header);

    header.appendChild(createButton('Restore original content', 
                                    restoreOriginalContent));
    header.appendChild(createButton('Dismiss this header', 
                                    dismissHeader));

    document.body.insertBefore(header, document.body.childNodes[0]);
}

