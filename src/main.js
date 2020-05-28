/*global chrome */

import {
    hasReplaceablePronouns,
    replacePronouns
} from "./pronoun-replacement.js";
import { textNodesUnder, isEditable } from "./dom-traversal.js";
import { inExcludedDomain, getWhyExcluded } from "./excluded-domains.js";
import {
    mentionsGender,
    visiblyMentionsGender,
    highlightGender,
    hasPersonalPronounSpec,
    highlightPersonalPronounSpecs
} from "./stopword-highlights.js";
import { Status } from "./status.js";

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

function ifExcludedWhy(host) {
    if (inExcludedDomain(host)) {
        return getWhyExcluded(host);
    } else {
        return null;
    }
}

// Called in content.js
export function main() {
    const originalBodyHTML = document.body.innerHTML;
    let extensionStatus;
    let somethingToToggle;

    if (inExcludedDomain(location.host)) {
        extensionStatus = Status.excludedDomain;
        chrome.runtime.sendMessage({ colorIcon: false });
    } else if (hasPersonalPronounSpec(originalBodyHTML)) {
        replaceWordsInBody(
            hasPersonalPronounSpec,
            highlightPersonalPronounSpecs
        );
        extensionStatus = Status.pronounSpecs;
        chrome.runtime.sendMessage({ colorIcon: true });
        somethingToToggle = "highlights";
    } else if (visiblyMentionsGender(document.body)) {
        replaceWordsInBody(mentionsGender, highlightGender);
        extensionStatus = Status.mentionsGender;
        chrome.runtime.sendMessage({ colorIcon: true });
        somethingToToggle = "highlights";
    } else {
        if (hasReplaceablePronouns(originalBodyHTML)) {
            replaceWordsInBody(hasReplaceablePronouns, replacePronouns);
        }
        if (document.body.innerHTML !== originalBodyHTML) {
            extensionStatus = Status.replacedPronouns;
            somethingToToggle = "changes";
        } else {
            extensionStatus = Status.noGenderedPronouns;
        }
        chrome.runtime.sendMessage({ colorIcon: true });
    }

    const toggler = makeToggler(somethingToToggle);
    let isToggled = false;

    // Respond to messages sent from the popup
    function handleMessage(request, sender, sendResponse) {
        if (request.type === "getStatus") {
            sendResponse({
                status: extensionStatus,
                isToggled: isToggled,
                whyExcluded: ifExcludedWhy(location.host)
            });
        } else if (request.type === "toggle") {
            toggler();
            isToggled = !isToggled;
        } else if (request.type === "reloadPage") {
            window.location.reload();
        } else {
            console.error(
                "Content script received a request with unrecognized type " +
                    request.type
            );
        }
    }

    chrome.runtime.onMessage.addListener(handleMessage);
}
