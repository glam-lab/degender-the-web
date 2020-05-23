/*global chrome */

import { Status } from "./status.js";

const CONNECTION_ERROR =
    "Could not establish connection. Receiving end does not exist.";

const ids = {
    status: "status",
    reloadPage: "reload-page",
    reloadMessage: "reload-message",
    showChanges: "show-changes",
    showChangesCheckbox: "show-changes-checkbox",
    showHighlights: "show-highlights",
    showHighlightsCheckbox: "show-highlights-checkbox",
    turnOnForHost: "turn-on-for-host",
    turnOnForHostCheckbox: "turn-on-for-host-checkbox"
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

function setVisibility(id, shouldBeVisible) {
    if (shouldBeVisible) {
        document.getElementById(id).classList.remove("hide");
        document.getElementById(id).classList.add("show");
    } else {
        document.getElementById(id).classList.remove("show");
        document.getElementById(id).classList.add("hide");
    }
}

function showElements(elementsToShow) {
    // If elementsToShow is not provided, hide everything except status.
    elementsToShow = elementsToShow || [];

    const allElements = [
        ids.reloadPage,
        ids.reloadMessage,
        ids.showChanges,
        ids.showHighlights,
        ids.turnOnForHost
    ];

    // Show only the elements specified, hide all others.
    for (const id of allElements) {
        setVisibility(id, elementsToShow.includes(id));
    }
}

function setStatusTo(newStatus, whyExcluded) {
    let statusText = "<i>Degender the Web</i> ";
    console.log("status: " + newStatus);
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
            showElements([ids.showHighlights]);
            break;

        case Status.mentionsGender:
            statusText += "did not rewrite gender pronouns because it ";
            statusText += "found this page discusses gender.";
            document.getElementById(ids.status).innerHTML = statusText;

            // Show highlight checkbox
            showElements([ids.showHighlights]);
            break;

        case Status.replacedPronouns:
            statusText += "has replaced gender pronouns on this page.";
            document.getElementById(ids.status).innerHTML = statusText;

            // Show "Show changes" checkbox
            showElements([ids.showChanges, ids.turnOnForHost]);
            break;

        case Status.noGenderedPronouns:
            statusText += "found no gender pronouns in static content ";
            statusText += "on this page.";
            document.getElementById(ids.status).innerHTML = statusText;

            // Show no buttons
            showElements();
            break;

        case Status.userDeniedHost:
            statusText =
                "You've turned off <i>Degender the Web</i> for this page.";
            document.getElementById(ids.status).innerHTML = statusText;

            // Show the (unchecked) host checkbox
            showElements([ids.turnOnForHost]);
            break;

        case Status.systemPage:
            statusText += "cannot run on system pages or the Chrome Web Store.";
            document.getElementById(ids.status).innerHTML = statusText;

            // Show no buttons
            showElements();
            break;

        case Status.genericReload:
            statusText = "";
            document.getElementById(ids.status).innerHTML = statusText;
            setReloadMessage("Reload the page to replace pronouns.");

            // Show reload button
            showElements([
                ids.turnOnForHost,
                ids.reloadPage,
                ids.reloadMessage
            ]);
            break;
    }
}

function updateStatus() {
    sendMessageToContentScript("getStatus", updateStatusCallback);
}

function loadDoNotReplaceList(callback) {
    chrome.storage.sync.get(
        {
            doNotReplaceList: []
        },
        function(items) {
            if (callback) {
                callback(items.doNotReplaceList);
            }
        }
    );
}

function saveDoNotReplaceList(doNotReplaceList, callback) {
    const items = { doNotReplaceList: doNotReplaceList };
    chrome.storage.sync.set(items, function() {
        if (callback) {
            callback();
        }
    });
}

function updateStatusCallback(response) {
    if (
        chrome.runtime.lastError &&
        chrome.runtime.lastError.message === CONNECTION_ERROR
    ) {
        response = null;
    }
    loadDoNotReplaceList(function(doNotReplaceList) {
        callOnTargetTab(function(tab) {
            const url = new URL(tab.url);

            if (response) {
                // Successfully messaged content script
                // Handler for host checkbox when replacements have been made
                document
                    .getElementById(ids.turnOnForHostCheckbox)
                    .addEventListener("click", toggleHostWithScript);

                setStatusTo(response.status, response.whyExcluded);

                // Only one checkbox is shown at a time, but either can be
                // represented by `isToggled`
                document.getElementById(ids.showChangesCheckbox).checked =
                    response.isToggled;
                document.getElementById(ids.showHighlightsCheckbox).checked =
                    response.isToggled;
                const hostCheckbox = document.getElementById(
                    ids.turnOnForHostCheckbox
                );
                hostCheckbox.checked = !doNotReplaceList.includes(url.host);
                toggleHostWithScript();
            } else {
                // Handler for host checkbox when the page hasn't been modified
                document
                    .getElementById(ids.turnOnForHostCheckbox)
                    .addEventListener("click", toggleHostWithoutScriptHandler);

                if (doNotReplaceList.includes(url.host)) {
                    setStatusTo(Status.userDeniedHost);
                } else if (
                    url.protocol === "chrome:" ||
                    url.hostname === "chrome.google.com"
                ) {
                    setStatusTo(Status.systemPage);
                } else {
                    // It's hard to tell how we got to this state when we can't
                    // communicate with the content script. Prompt to reload.
                    setStatusTo(Status.genericReload);
                }
            }
        });
    });
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

function toggleSomething() {
    sendMessageToContentScript("toggle");
}

function reloadPage() {
    callOnTargetTab(function(tab) {
        chrome.tabs.reload(tab.id);
        window.close();
    });
}

function setReloadMessage(message) {
    document.getElementById(ids.reloadMessage).innerHTML = message;
}

/**
 * Handler for host checkbox when the page hasn't been modified
 */
function toggleHostWithoutScriptHandler() {
    const checked = document.getElementById(ids.turnOnForHostCheckbox).checked;

    // If a status has made the reload button visible, we can't hide it here
    const reloadVisibility = document
        .getElementById(ids.reloadPage)
        .classList.contains("show");

    callOnTargetTab(function(tab) {
        const url = new URL(tab.url);
        loadDoNotReplaceList(function(doNotReplaceList) {
            if (checked) {
                setReloadMessage("Reload the page to replace pronouns.");
                setVisibility(ids.reloadPage, true);
                setVisibility(ids.reloadMessage, true);

                doNotReplaceList = doNotReplaceList.filter(function(s) {
                    return s !== url.host;
                });
            } else {
                // The box was probably checked, then unchecked.
                // Hide the reload message, since reloading will do nothing.
                setVisibility(ids.reloadPage, reloadVisibility);
                setVisibility(ids.reloadMessage, false);
                doNotReplaceList.push(url.host);
            }
            saveDoNotReplaceList(doNotReplaceList);
        });
    });
}

function toggleHostWithScript() {
    // The checkbox indicates whether replacements are allowed on this host
    const isChecked = document.getElementById(ids.turnOnForHostCheckbox)
        .checked;

    callOnTargetTab(function(tab) {
        const url = new URL(tab.url);
        loadDoNotReplaceList(function(doNotReplaceList) {
            if (isChecked) {
                // The box was probably unchecked, then re-checked.
                // Hide the reload message, since reloading will do nothing.
                setVisibility(ids.reloadPage, false);
                setVisibility(ids.reloadMessage, false);

                doNotReplaceList = doNotReplaceList.filter(function(s) {
                    return s !== url.host;
                });
            } else {
                setReloadMessage(
                    "Reload the page to revert pronoun replacements."
                );
                setVisibility(ids.reloadPage, true);
                setVisibility(ids.reloadMessage, true);
                doNotReplaceList.push(url.host);
            }
            saveDoNotReplaceList(doNotReplaceList);
        });
    });
}

document.getElementById(ids.reloadPage).addEventListener("click", reloadPage);

document
    .getElementById(ids.showChangesCheckbox)
    .addEventListener("click", toggleSomething);
document
    .getElementById(ids.showHighlightsCheckbox)
    .addEventListener("click", toggleSomething);

// Special URL parameter used for testing
const isTest = getUrlParameter("test") === "true";

updateStatus();
