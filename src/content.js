/*global chrome */

// See https://medium.com/@otiai10/how-to-use-es6-import-with-chrome-extension-bd5217b9c978
(async () => {
    const src = chrome.extension.getURL("src/main.js");
    const contentScript = await import(src);

    // Check if the user has disabled DGtW for this host.
    chrome.storage.sync.get(
        {
            blacklist: []
        },
        function(items) {
            // If DGtW isn't blacklisted on this host, run the content script.
            if (
                // Check if it matches one of the items in the blacklist.
                !items.blacklist.some(
                    String.prototype.startsWith,
                    location.host
                )
            ) {
                contentScript.main();
            }
        }
    );
})();
