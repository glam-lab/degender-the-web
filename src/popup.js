/*global chrome */

import { Status } from "./status.js";

const ids = {
    status: "status",
    restore: "restore",
    showChanges: "show-changes",
    showChangesCheckbox: "show-changes-checkbox",
    showHighlights: "show-highlights",
    showHighlightsCheckbox: "show-highlights-checkbox"
};

// Controls the DGtW content script on the current page
function sendMessageToContentScript(type, callback) {
    // If this is a test, the popup is opened in a tab. This steals focus from
    // the tab in which the content script is running.
    const queryInfo = { active: !isTest, currentWindow: true };

    chrome.tabs.query(queryInfo, function(tabs) {
        // Normally, only one tab matches the query.
        // When testing, a blank tab might match the query. Using `length - 1`
        // picks the correct target, the most recently opened background tab.
        const targetTab = tabs[tabs.length - 1].id;
        chrome.tabs.sendMessage(targetTab, { type: type }, callback);
    });
}

function showElement(id) {
    document.getElementById(id).classList.remove("hide");
    document.getElementById(id).classList.add("show");
}

function hideElement(id) {
    document.getElementById(id).classList.remove("show");
    document.getElementById(id).classList.add("hide");
}

function setStatusTo(newStatus, whyExcluded) {
    let statusText = "<i>Degender the web</i> ";
    switch (newStatus) {
        case Status.excludedDomain:
            statusText += "does not run on this site due to ";
            statusText += whyExcluded + ".";

            // Show no buttons
            hideElement(ids.showChanges);
            hideElement(ids.showHighlights);
            hideElement(ids.restore);
            break;

        case Status.pronounSpecs:
            statusText += "did not rewrite gender pronouns because it ";
            statusText += "found personal pronoun specifiers on this page.";

            // Show highlight checkbox
            hideElement(ids.showChanges);
            showElement(ids.showHighlights);
            showElement(ids.restore);
            break;

        case Status.mentionsGender:
            statusText += "did not rewrite gender pronouns because it ";
            statusText += "found this page discusses gender.";

            // Show highlight checkbox
            hideElement(ids.showChanges);
            showElement(ids.showHighlights);
            showElement(ids.restore);
            break;

        case Status.replacedPronouns:
            statusText += "has replaced gender pronouns on this page.";

            // Show "Show changes" checkbox
            showElement(ids.showChanges);
            hideElement(ids.showHighlights);
            showElement(ids.restore);
            break;

        case Status.noGenderedPronouns:
            statusText += "found no gender pronouns in static content ";
            statusText += "on this page.";

            // Show no buttons.
            hideElement(ids.showChanges);
            hideElement(ids.showHighlights);
            hideElement(ids.restore);
            break;

        case Status.restoredOriginal:
            statusText = "The original content has been restored.";

            // TODO Show reload button to redo replacements.
            hideElement(ids.showChanges);
            hideElement(ids.showHighlights);
            hideElement(ids.restore);
            break;
    }
    document.getElementById(ids.status).innerHTML = statusText;
}

function updateStatus() {
    sendMessageToContentScript("getStatus", updateStatusCallback);
}

function updateStatusCallback(response) {
    if (response) {
        setStatusTo(response.status, response.whyExcluded);

        // Only one checkbox is shown at a time, but either can be
        // represented by `isToggled`
        document.getElementById(ids.showChangesCheckbox).checked =
            response.isToggled;
        document.getElementById(ids.showHighlightsCheckbox).checked =
            response.isToggled;
    } else {
        // This is probably a system page and the popup shouldn't display.
        window.close();
    }
}

// From https://stackoverflow.com/a/29998214
function getUrlParameter(sParam) {
    const sPageURL = window.location.search.substring(1);
    const sURLVariables = sPageURL.split("&");
    for (let i = 0; i < sURLVariables.length; i++) {
        const sParameterName = sURLVariables[i].split("=");
        if (sParameterName[0] === sParam) {
            return sParameterName[1];
        }
    }
}

function restoreOriginalContent() {
    sendMessageToContentScript("restoreOriginalContent", updateStatusCallback);
}

function toggleSomething() {
    sendMessageToContentScript("toggle");
}

document
    .getElementById(ids.restore)
    .addEventListener("click", restoreOriginalContent);

document
    .getElementById(ids.showChangesCheckbox)
    .addEventListener("click", toggleSomething);
document
    .getElementById(ids.showHighlightsCheckbox)
    .addEventListener("click", toggleSomething);

// Special URL parameter used for testing
const isTest = getUrlParameter("test") === "true";

// Display extension status when popup is opened
updateStatus();
