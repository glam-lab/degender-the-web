/*globals chrome */

/**
 * This module gives us access to the Chrome extension storage API when running
 * tests with Puppeteer.
 *
 * While the extension itself can access the storage module at
 * `chrome.storage`, the Puppeteer context doesn't have the same access to the
 * storage module. The functions below correspond to the `get`, `set`, and
 * `clear` methods of `chrome.storage.sync`. These functions have a few big
 * differences from those in the storage API:
 * - they are asyncronous and can be awaited to get the result that would
 *   otherwise be passed into the storage callback function
 * - they require an extension page as their first argument, such as the
 *   options page or the popup
 * - not counting the first argument, arguments and return values must be
 *   JSON-serializable
 *
 * More information on the storage API can be found here:
 * https://developer.chrome.com/extensions/storage
 */

function get(page, defaults) {
    return page
        .evaluate(function(jsonDefaults) {
            return new Promise(function(resolve) {
                chrome.storage.sync.get(JSON.parse(jsonDefaults), items =>
                    resolve(JSON.stringify(items))
                );
            });
        }, JSON.stringify(defaults))
        .then(jsonItems => JSON.parse(jsonItems));
}

function set(page, items) {
    return page.evaluate(function(jsonItems) {
        return new Promise(function(resolve) {
            chrome.storage.sync.set(JSON.parse(jsonItems), resolve);
        });
    }, JSON.stringify(items));
}

function clear(page) {
    return page.evaluate(function() {
        return new Promise(resolve => chrome.storage.sync.clear(resolve));
    });
}

exports.storage = {
    get: get,
    set: set,
    clear: clear
};
