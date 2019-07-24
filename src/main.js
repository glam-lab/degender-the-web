import { dictionary, replacePronouns } from './word-replacement.js';
import { createHeader, createButton } from './dom-construction.js';
import { textNodesUnder, isEditable } from './dom-traversal.js';
import { inExcludedDomain, whyExcluded } from './excluded-domains.js';

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
            let text = replacePronouns(originalText);
            let span = document.createElement("span");
            span.innerHTML = text;
            node.parentNode.replaceChild(span, node);
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

