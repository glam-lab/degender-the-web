import { hasReplaceableWords, replacePronouns } from './word-replacement.js';
import { textNodesUnder, isEditable } from './dom-traversal.js';
import { inExcludedDomain, getExcludedDomain, whyExcluded } from './excluded-domains.js';
import { hasPersonalPronounSpec, getPersonalPronounSpecs, highlightPersonalPronounSpecs} 
       from './personal-pronouns.js';
import { replacementClass, createHeader, createButton } from './dom-construction.js';

// The core algorithm: If a text node contains one or more keywords, 
// create new nodes containing the substitute text and the surrounding text.
function replacePronounsInBody() {
    // We collect all text nodes in a list before processing them because 
    // modification in place seems to disrupt a TreeWalker traversal.
    const textNodes = textNodesUnder(document.body);
    let node = null;
    for (node of textNodes) {
        const originalText = node.nodeValue;
        if (hasReplaceableWords(originalText) && !(isEditable(node))) {
            const newText = replacePronouns(originalText);
            const span = document.createElement("span");
            span.innerHTML = newText;
            node.parentNode.replaceChild(span, node);
        }
    }
    
    // Fix the width of all "replacement" spans so the text does not reflow
    // when the node content is replaced. 
    // (This relies on the observation than "they/them/their" is longer than
    // "he/him/his" or "she/her/her".)
    const replacementNodes = document.getElementsByClassName(replacementClass);
    for (node of replacementNodes) {
        const width = node.offsetWidth + 3; // Find the node's width as rendered
        node.style.width = width + "px";    // Set the width explicitly
    }
}

// For a consistent interface, though it's very simple...
function highlightPersonalPronounSpecsInBody() {
    document.body.innerHTML = 
        highlightPersonalPronounSpecs(document.body.innerHTML);
}

// Called in content.js
export function main() {
    // Use a closure to capture the original content before ANY changes.
    const restoreOriginalContent = (function() {
        const originalContent = document.body.innerHTML;
        return function() {
            document.body.innerHTML = originalContent;
        };
    })();

    let message = '<i>Degender the Web</i> ';

    if (inExcludedDomain(location)) {
        const domain = getExcludedDomain(location);
        message += ' does not run on ' + domain + 
                   ' due to ' + whyExcluded(domain) + '.';
    } else if (hasPersonalPronounSpec(document.body.innerHTML)) {
        highlightPersonalPronounSpecsInBody();
        message += ' found personal pronoun specifiers (' +
                   getPersonalPronounSpecs(document.body.innerHTML) +
                   ') on this page.';
    } else {
        if (hasReplaceableWords(document.body.innerHTML)) {
            replacePronounsInBody(); 
        }
        if (document.body.innerHTML.includes('class="'+replacementClass+'"')) {
            message += ' has replaced gendered pronouns on this page.';
        } else {
            message += ' found no gendered pronouns in static content ' +
                       ' on this page.';
       }
    }

    // Insert the header for Degender the Web, with the constructed message.
    const header = createHeader(message);
    const dismissHeader = (function(element) {
        return function() { element.style.display = 'none'; };
    })(header);
    header.appendChild(createButton('Restore original content', 
                                    restoreOriginalContent));
    header.appendChild(createButton('Dismiss this header', 
                                    dismissHeader));
    document.body.insertBefore(header, document.body.childNodes[0]);
}

