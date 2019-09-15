/*global chrome */

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "getStatus" }, function(
        response
    ) {
        document.getElementById("status").innerHTML = response.statusText;
    });
});
