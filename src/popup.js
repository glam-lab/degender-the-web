/*global chrome */

// TODO This is duplicated from main.js, make it more dry or remove it from
// main.js when the header gets removed.
const ids = {
    header: "dgtw-header",
    dismiss: "dgtw-dismiss",
    status: "dgtw-status",
    restore: "dgtw-restore",
    toggle: "dgtw-toggle"
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

function updateStatus() {
    sendMessageToContentScript("getStatus", function(response) {
        document.getElementById(ids.status).innerHTML = response.statusText;
        document.getElementById(ids.toggle).checked = response.isToggled;
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

function restoreOriginalContent() {
    sendMessageToContentScript("restoreOriginalContent");
}

function toggleSomething() {
    sendMessageToContentScript("toggle");
}

document
    .getElementById(ids.restore)
    .addEventListener("click", restoreOriginalContent);

document.getElementById(ids.toggle).addEventListener("click", toggleSomething);

// Special parameter used for testing
const isTest = getUrlParameter("test") === "true";

// Display extension status when popup is opened
updateStatus();
