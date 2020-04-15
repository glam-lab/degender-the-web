/*globals chrome */
function get(page, defaults) {
    return new Promise(function(resolve) {
        // Let the page execute resolution function in Puppeteer context
        page._pageBindings.delete("resolve");
        page.exposeFunction("resolve", resolve).then(function() {
            // Resolve the Promise only once storage is cleared
            page.evaluate(function(defaults) {
                chrome.storage.sync.get(defaults, function(items) {
                    resolve(items);
                });
            }, defaults);
        });
    });
}

function set(page, items) {
    return new Promise(function(resolve) {
        // Let the page execute resolution function in Puppeteer context
        page._pageBindings.delete("resolve");
        page.exposeFunction("resolve", resolve).then(function() {
            // Resolve the Promise only once storage is cleared
            page.evaluate(function(items) {
                chrome.storage.sync.set(items, function() {
                    resolve();
                });
            }, items);
        });
    });
}

function clear(page) {
    return new Promise(function(resolve) {
        // Let the page execute resolution function in Puppeteer context
        page._pageBindings.delete("resolve");
        page.exposeFunction("resolve", resolve).then(function() {
            // Resolve the Promise only once storage is cleared
            page.evaluate(function() {
                chrome.storage.sync.clear(function() {
                    resolve();
                });
            });
        });
    });
}

exports.storage = {
    get: get,
    set: set,
    clear: clear
};
