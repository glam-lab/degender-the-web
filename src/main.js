/*global chrome */

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
import { createHeader, createButton } from "./dom-construction.js";

const ids = {
    header: "dgtw-header", // TODO Remove when removing header
    dismiss: "dgtw-dismiss", // TODO Remove when removing header
    status: "dgtw-status",
    restore: "dgtw-restore",
    toggle: "dgtw-toggle"
};

// Make a function to restore the original page content.
// Expects to receive document.body.innerHTML.
function makeRestorer(originalHTML) {
    return function() {
        document.body.innerHTML = originalHTML;
    };
}

// Make a function to dismiss the header.
function makeDismisser() {
    return function() {
        const header = document.querySelector("#" + ids.header);
        header.style.display = "none";
    };
}

// Make a function to toggle markup.
// Expects the name of the thing to be toggled ("changes" or "highlights").
function makeToggler(somethingToToggle) {
    let showMarkup = false;
    return function toggleShowMarkup() {
        // Toggle the flag
        showMarkup = !showMarkup;

        // Toggle the style classes
        document.querySelectorAll(".dgtw").forEach(function(node) {
            node.classList.add(showMarkup ? "show" : "hide");
            node.classList.remove(showMarkup ? "hide" : "show");
        });

        // Toggle the button text
        const button = document.querySelector("#" + ids.toggle);
        button.innerHTML = (showMarkup ? "Hide " : "Show ") + somethingToToggle;
    };
}

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
            const newText = replaceFunction(originalText, true);
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
}

// Called in content.js
export function main() {
    const originalBodyHTML = document.body.innerHTML;
    let message = "<i>Degender the Web</i> ";
    let somethingToToggle;

    if (inExcludedDomain(location.host)) {
        message +=
            " does not run on " +
            getExcludedDomain(location.host) +
            " due to " +
            getWhyExcluded(location.host) +
            ".";
    } else if (hasPersonalPronounSpec(originalBodyHTML)) {
        replaceWordsInBody(
            hasPersonalPronounSpec,
            highlightPersonalPronounSpecs
        );
        message += " did not rewrite gender pronouns because it ";
        message += " found personal pronoun specifiers on this page: ";
        message += getPersonalPronounSpecs(originalBodyHTML);
        somethingToToggle = "highlights";
    } else if (visiblyMentionsGender(document.body)) {
        replaceWordsInBody(mentionsGender, highlightGender);
        message += " did not rewrite gender pronouns because it ";
        message += " found this page discusses gender.";
        somethingToToggle = "highlights";
    } else {
        if (hasReplaceablePronouns(originalBodyHTML)) {
            replaceWordsInBody(hasReplaceablePronouns, replacePronouns);
        }
        if (document.body.innerHTML !== originalBodyHTML) {
            message += " has replaced gender pronouns on this page.";
            somethingToToggle = "changes";
        } else {
            message +=
                " found no gender pronouns in static content " +
                " on this page.";
        }
    }

    // Create the header for Degender the Web, with the constructed message.
    const header = createHeader(ids.header, message);

    // Create the buttons.
    header.appendChild(
        createButton(ids.dismiss, "Dismiss this header", makeDismisser())
    );
    header.appendChild(
        createButton(
            ids.restore,
            "Restore original content",
            makeRestorer(originalBodyHTML)
        )
    );
    if (somethingToToggle) {
        header.appendChild(
            createButton(
                ids.toggle,
                "Show " + somethingToToggle,
                makeToggler(somethingToToggle)
            )
        );
    }

    const restoreOriginalContent = makeRestorer(originalBodyHTML);
    const diffToggler = makeToggler(somethingToToggle);

    // Display the header at the top of the page.
    document.body.insertBefore(header, document.body.childNodes[0]);

    // Respond to messages sent from the popup
    chrome.runtime.onMessage.addListener(function(
        request,
        sender,
        sendResponse
    ) {
        if (request.type === "getStatus") {
            sendResponse({ statusText: message });
        } else if (request.type === "restoreOriginalContent") {
            restoreOriginalContent();
        } else if (request.type === "diffToggle") {
            diffToggler();
        } else {
            console.error(
                "Content script received a request with unrecognized type " +
                    request.type
            );
        }
    });
}
