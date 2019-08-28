/*global chrome */

// See https://medium.com/@otiai10/how-to-use-es6-import-with-chrome-extension-bd5217b9c978
(async () => {
    const src = chrome.extension.getURL("src/main.js");
    const contentScript = await import(src);
    contentScript.main();
})();
