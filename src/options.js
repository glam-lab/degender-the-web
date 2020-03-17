/*global chrome */
// Saves options to chrome.storage
function save_options() {
    let doNotReplaceList = document
        .getElementById("doNotReplaceList")
        .value.split("\n");
    doNotReplaceList = doNotReplaceList.filter(Boolean); // Remove empty strings

    chrome.storage.sync.set(
        {
            doNotReplaceList: doNotReplaceList
        },
        function() {
            // Update status to let user know options were saved.
            const status = document.getElementById("status");
            status.classList.remove("hide");
            status.classList.add("show");
            setTimeout(function() {
                status.classList.add("show");
                status.classList.remove("hide");
            }, 750);
        }
    );
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get(
        {
            doNotReplaceList: []
        },
        function(items) {
            const doNotReplaceListText = items.doNotReplaceList.join("\n");
            document.getElementById(
                "doNotReplaceList"
            ).value = doNotReplaceListText;
        }
    );
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
