/*global chrome */

// From https://stackoverflow.com/a/29173057
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // read `newIconPath` from request and read `tab.id` from sender
    let path;
    if (request.colorIcon) {
        path = "img/icon16.png";
    } else {
        path = "img/icon16-disabled.png";
    }
    chrome.browserAction.setIcon({
        path: path,
        tabId: sender.tab.id
    });
});
