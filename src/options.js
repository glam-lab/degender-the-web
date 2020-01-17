/*global chrome */
// Saves options to chrome.storage
function save_options() {
    const allowAnalytics = document.getElementById("allow-analytics").checked;
    chrome.storage.sync.set(
        {
            allowAnalytics: allowAnalytics
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
    // Allow analytics by default
    chrome.storage.sync.get(
        {
            allowAnalytics: true
        },
        function(items) {
            document.getElementById("allow-analytics").checked =
                items.allowAnalytics;
        }
    );
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
