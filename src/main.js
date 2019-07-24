import { hasReplaceableWords, replacePronouns } from './word-replacement.js';
import { createHeader, createButton } from './dom-construction.js';
import { textNodesUnder, isEditable } from './dom-traversal.js';
import { inExcludedDomain, whyExcluded } from './excluded-domains.js';

// The core algorithm: If a text node contains one or more keywords, 
// create new nodes containing the substitute text and the surrounding text.
// We collect all nodes in a list before processing them because modification 
// in place seems to disrupt the TreeWalker traversal.
function replacePronounsInBody() {
    const textNodes = textNodesUnder(document.body);
    let node = null;
    for (node of textNodes) {
        let originalText = node.nodeValue;
    
        // Apply NLP only if the original text contains at least one keyword
        // and the node is not part of a form or other editable component.
        if (hasReplaceableWords(originalText) && !(isEditable(node))) {
            const text = replacePronouns(originalText);
            const span = document.createElement("span");
            span.innerHTML = text;
            node.parentNode.replaceChild(span, node);
        }
    }
    
    // Fix the width of all "replacement" spans so the text does not reflow
    // when the node content is replaced. 
    // (This relies on the observation than "they/them/their" is longer than
    // "he/him/his" or "she/her/her".)
    const replacementNodes = document.getElementsByClassName("replacement");
    for (node of replacementNodes) {
        const width = node.offsetWidth;    // Find the node's width as rendered.
        node.style.width = width + "px"; // Set the width explicitly in its style.
    }
}

// If this is not an excluded domain, replace the pronouns!
export function main() {
    const restoreOriginalContent = (function() {
        const originalContent = document.body.innerHTML;
        return function() {
            document.body.innerHTML = originalContent;
        };
    })();

    let message = '<i>Degender the Web</i> ';

    const domain = inExcludedDomain(location);
    if (domain) {
        message += ' does not run on ' + domain + 
                   ' due to ' + whyExcluded(domain) + '.';
    } else {
        replacePronounsInBody(); 
        if (document.body.innerHTML.includes('class="dgtw-replacement"')) { 
            message += ' has replaced gendered pronouns on this page.';
        } else {
            message += ' found no gendered pronouns in static content ' +
                       ' on this page.';
       }
    }

    const header = createHeader(message);
    const dismissHeader = (function(element) {
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

