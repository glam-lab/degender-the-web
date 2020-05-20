/*global chrome */

// See https://medium.com/@otiai10/how-to-use-es6-import-with-chrome-extension-bd5217b9c978
// Any changes to this file require the extension to be reloaded.
(async () => {
    const src = chrome.extension.getURL("src/main.js");
    const contentScript = await import(src);

    // Omit inessential URL components when performing comparison.
    const url = location.host + location.pathname;

    // Check if the user has disabled DGtW for this page.
    chrome.storage.sync.get(
        {
            doNotReplaceList: []
        },
        function(items) {
            // If DGtW is allowed to access this page, run the content script.
            if (
                // Check if the URL matches none of the items in the list.
                !items.doNotReplaceList.some(String.prototype.startsWith, url)
            ) {
                contentScript.main();
            }
        }
    );
})();
