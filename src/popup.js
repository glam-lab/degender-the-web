/*global chrome */

import { Status } from "./status.js";

const ids = {
    status: "status",
    restore: "restore",
    reloadPage: "reload-page",
    showChanges: "show-changes",
    showChangesCheckbox: "show-changes-checkbox",
    showHighlights: "show-highlights",
    showHighlightsCheckbox: "show-highlights-checkbox"
};

function callOnTargetTab(callback) {
    const queryInfo = { active: !isTest, currentWindow: true };
    chrome.tabs.query(queryInfo, function(tabs) {
        // Normally, only one tab matches the query.
        // When testing, a blank tab might match the query. Using `length - 1`
        // picks the correct target, the most recently opened background tab.
        const tab = tabs[tabs.length - 1];
        callback(tab);
    });
}

// Controls the DGtW content script on the current page
function sendMessageToContentScript(type, callback) {
    // If this is a test, the popup is opened in a tab. This steals focus from
    // the tab in which the content script is running.
    callOnTargetTab(function(tab) {
        chrome.tabs.sendMessage(tab.id, { type: type }, callback);
    });
}

function showElements(elementsToShow) {
    // If elementsToShow is not provided, hide everything except status.
    elementsToShow = elementsToShow || [];

    const allElements = [
        ids.restore,
        ids.reloadPage,
        ids.showChanges,
        ids.showHighlights
    ];

    // Show only the elements specified, hide all others.
    for (const id of allElements) {
        if (elementsToShow.includes(id)) {
            document.getElementById(id).classList.remove("hide");
            document.getElementById(id).classList.add("show");
        } else {
            document.getElementById(id).classList.remove("show");
            document.getElementById(id).classList.add("hide");
        }
    }
}

function setStatusTo(newStatus, whyExcluded) {
    let statusText = "<i>Degender the web</i> ";
    switch (newStatus) {
        case Status.excludedDomain:
            statusText += "does not run on this site due to ";
            statusText += whyExcluded + ".";
            document.getElementById(ids.status).innerHTML = statusText;

            // Show no buttons
            showElements();
            break;

        case Status.pronounSpecs:
            statusText += "did not rewrite gender pronouns because it ";
            statusText += "found personal pronoun specifiers on this page.";
            document.getElementById(ids.status).innerHTML = statusText;

            // Show highlight checkbox
            showElements([ids.showHighlights, ids.restore]);
            break;

        case Status.mentionsGender:
            statusText += "did not rewrite gender pronouns because it ";
            statusText += "found this page discusses gender.";
            document.getElementById(ids.status).innerHTML = statusText;

            // Show highlight checkbox
            showElements([ids.showHighlights, ids.restore]);
            break;

        case Status.replacedPronouns:
            statusText += "has replaced gender pronouns on this page.";
            document.getElementById(ids.status).innerHTML = statusText;

            // Show "Show changes" checkbox
            showElements([ids.showChanges, ids.restore]);
            break;

        case Status.noGenderedPronouns:
            statusText += "found no gender pronouns in static content ";
            statusText += "on this page.";
            document.getElementById(ids.status).innerHTML = statusText;

            // Show no buttons
            showElements();
            break;

        case Status.restoredOriginal:
            statusText = "The original content has been restored.";
            document.getElementById(ids.status).innerHTML = statusText;

            // Show reload button
            showElements([ids.reloadPage]);
            break;

        case Status.userDeniedHost:
            statusText =
                "You've turned off <i>Degender the Web</i> for this page.";
            document.getElementById(ids.status).innerHTML = statusText;

            // Show no buttons
            showElements();
            break;

        case Status.userDeniedHostReload:
            statusText =
                "You've turned off <i>Degender the Web</i> for " +
                "this page. Reload the page to revert pronoun replacements.";
            document.getElementById(ids.status).innerHTML = statusText;

            // Show only the reload button
            showElements([ids.reloadPage]);
            break;
    }
}

function updateStatus() {
    sendMessageToContentScript("getStatus", updateStatusCallback);
}

function updateStatusCallback(response) {
    if (response) {
        chrome.storage.sync.get({ doNotReplaceList: [] }, function(items) {
            callOnTargetTab(function(tab) {
                const url = tab.url
                    .split("://")
                    .slice(1)
                    .join("://");
                if (
                    items.doNotReplaceList.some(
                        String.prototype.startsWith,
                        url
                    )
                ) {
                    // DGtW is turned off for this page,
                    // but the page hasn't been reloaded.
                    setStatusTo(Status.userDeniedHostReload);
                } else {
                    setStatusTo(response.status, response.whyExcluded);
                    // Only one checkbox is shown at a time, but either can be
                    // represented by `isToggled`
                    document.getElementById(ids.showChangesCheckbox).checked =
                        response.isToggled;
                    document.getElementById(
                        ids.showHighlightsCheckbox
                    ).checked = response.isToggled;
                }
            });
        });
    }

    // Special handling for non-responsive content script.
    if (
        chrome.runtime.lastError &&
        chrome.runtime.lastError.message ===
            "Could not establish connection. Receiving end does not exist."
    ) {
        chrome.storage.sync.get({ doNotReplaceList: [] }, function(items) {
            callOnTargetTab(function(tab) {
                const url = tab.url
                    .split("://")
                    .slice(1)
                    .join("://");
                if (
                    items.doNotReplaceList.some(
                        String.prototype.startsWith,
                        url
                    )
                ) {
                    setStatusTo(Status.userDeniedHost);
                } else {
                    // This is probably a system page.
                    window.close();
                }
            });
        });
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

function reloadPage() {
    sendMessageToContentScript("reloadPage");
    window.close();
}

document
    .getElementById(ids.restore)
    .addEventListener("click", restoreOriginalContent);

document.getElementById(ids.reloadPage).addEventListener("click", reloadPage);

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
