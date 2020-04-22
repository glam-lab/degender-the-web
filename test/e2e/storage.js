/*globals chrome */
// _pageBindings solution from https://stackoverflow.com/a/59138297/9158894

// It's not worth it to DRY this any longer
function awaitCallback(page, f) {
    return new Promise(function(resolve) {
        page._pageBindings.delete("resolve");
        page.exposeFunction("resolve", resolve).then(f);
    });
}

function get(page, defaults) {
    return awaitCallback(page, function(resolve) {
        page.evaluate(function(defaults) {
            chrome.storage.sync.get(defaults, function(items) {
                resolve(items);
            });
        }, defaults);
    });
}

function set(page, items) {
    return awaitCallback(page, function(resolve) {
        page.evaluate(function(items) {
            chrome.storage.sync.set(items, function() {
                resolve();
            });
        }, items);
    });
}

function clear(page) {
    return awaitCallback(page, function(resolve) {
        page.evaluate(function() {
            chrome.storage.sync.clear(function() {
                resolve();
            });
        });
    });
}

exports.storage = {
    get: get,
    set: set,
    clear: clear
};
