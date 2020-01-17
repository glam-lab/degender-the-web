/*global chrome */
// Saves options to chrome.storage
function save_options() {
    const blacklist = document.getElementById("blacklist").value.split("\n");
    chrome.storage.sync.set(
        {
            blacklist: blacklist
        },
        function() {
            // Update status to let user know options were saved.
            const status = document.getElementById("status");
            status.textContent = "Options saved.";
            setTimeout(function() {
                status.textContent = "";
            }, 750);
        }
    );
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get(
        {
            blacklist: []
        },
        function(items) {
            const blacklistText = items.blacklist.join("\n");
            document.getElementById("blacklist").value = blacklistText;
        }
    );
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
