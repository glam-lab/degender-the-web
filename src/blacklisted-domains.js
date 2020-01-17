/*globals chrome */
// Runs the callback function only if DGtW is not blocked on the host.
export function inUserBlacklist(host, callback) {
    const matchesHost = function(element) {
        // TODO Make this more clever
        return host.startsWith(element);
    };

    chrome.storage.sync.get(function(items) {
        console.log(items.blacklist);
        console.log("URL: " + host);
        if (items.blacklist.some(matchesHost)) {
            console.log("Degender the Web is disabled on this page.");
        } else {
            callback();
        }
    });
}
