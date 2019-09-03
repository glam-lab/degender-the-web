import {
    hasReplaceablePronouns,
    replacePronouns
} from "./pronoun-replacement.js";
import { textNodesUnder, isEditable } from "./dom-traversal.js";
import {
    inExcludedDomain,
    getExcludedDomain,
    getWhyExcluded
} from "./excluded-domains.js";
import {
    mentionsGender,
    visiblyMentionsGender,
    highlightGender,
    hasPersonalPronounSpec,
    highlightPersonalPronounSpecs,
    getPersonalPronounSpecs
} from "./stopword-highlights.js";
import {
    replacementClass,
    createHeader,
    createButton
} from "./dom-construction.js";

// The core algorithm: If a text node contains one or more keywords,
// create new nodes containing the substitute text and the surrounding text.
function replaceWordsInBody(needsReplacement, replaceFunction) {
    // We collect all text nodes in a list before processing them because
    // modification in place seems to disrupt a TreeWalker traversal.
    const textNodes = textNodesUnder(document.body);
    let node = null;
    for (node of textNodes) {
        const originalText = node.nodeValue;
        if (needsReplacement(originalText) && !isEditable(node)) {
            const newText = replaceFunction(originalText);
            const siblings = node.parentNode.childNodes;
            if (siblings.length === 1) {
                node.parentNode.innerHTML = newText;
            } else {
                const span = document.createElement("span");
                span.innerHTML = newText;
                node.parentNode.replaceChild(span, node);
            }
        }
    }

    // Fix the width of all "replacement" spans so the text does not reflow
    // when the node content is replaced.
    // (This relies on the observation than "they/them/their" is longer than
    // "he/him/his" or "she/her/her".)
    const replacementNodes = document.getElementsByClassName(replacementClass);
    for (node of replacementNodes) {
        const width = node.offsetWidth + 3; // Find the node's width as rendered
        node.style.width = width + "px"; // Set the width explicitly
    }
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

    const body = document.body.innerHTML;
    let message = "<i>Degender the Web</i> ";

    if (inExcludedDomain(location.host)) {
        message +=
            " does not run on " +
            getExcludedDomain(location.host) +
            " due to " +
            getWhyExcluded(location.host) +
            ".";
    } else if (hasPersonalPronounSpec(body)) {
        replaceWordsInBody(
            hasPersonalPronounSpec,
            highlightPersonalPronounSpecs
        );
        message += " did not rewrite gender pronouns because it ";
        message += " found personal pronoun specifiers on this page: ";
        message += getPersonalPronounSpecs(body);
    } else if (visiblyMentionsGender(document.body)) {
        replaceWordsInBody(mentionsGender, highlightGender);
        message += " did not rewrite gender pronouns because it ";
        message += " found this page discusses gender.";
    } else {
        if (hasReplaceablePronouns(body)) {
            replaceWordsInBody(hasReplaceablePronouns, replacePronouns);
        }
        if (document.body.innerHTML.includes(replacementClass)) {
            message += " has replaced gender pronouns on this page.";
        } else {
            message +=
                " found no gender pronouns in static content " +
                " on this page.";
        }
    }

    // Create the header for Degender the Web, with the constructed message.
    const header = createHeader(message);
    const dismissHeader = (function(element) {
        return function() {
            element.style.display = "none";
        };
    })(header);
    header.appendChild(
        createButton(
            "restore",
            "Restore original content",
            restoreOriginalContent
        )
    );
    header.appendChild(
        createButton("dismiss", "Dismiss this header", dismissHeader)
    );

    // Display the header at the top of the page.
    document.body.insertBefore(header, document.body.childNodes[0]);
}
