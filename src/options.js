/*global chrome */
function restore_options() {
    loadDoNotReplaceList(function(doNotReplaceList) {
        displayDoNotReplaceList(doNotReplaceList);
    });
}

function loadDoNotReplaceList(callback) {
    chrome.storage.sync.get(
        {
            doNotReplaceList: []
        },
        function(items) {
            if (callback) {
                callback(items.doNotReplaceList);
            }
        }
    );
}

function saveDoNotReplaceList(doNotReplaceList, callback) {
    const items = { doNotReplaceList: doNotReplaceList };
    chrome.storage.sync.set(items, function(items) {
        if (callback) {
            callback();
        }
    });
}

function addItem() {
    const newEntryField = document.getElementById("newEntry");

    // We can't use the URL API here, as it requires a protocol
    let url = newEntryField.value;

    if (url.includes("://")) {
        // Strip off the protocol using the first instance of '://'
        url = url
            .split("://")
            .slice(1)
            .join("://");
    }
    url = url.split("/")[0];

    newEntryField.value = "";
    loadDoNotReplaceList(function(doNotReplaceList) {
        doNotReplaceList.push(url);
        doNotReplaceList.sort();
        saveDoNotReplaceList(doNotReplaceList);

        // Update the displayed list
        displayDoNotReplaceList(doNotReplaceList);
    });
}

function removeItem(urlToRemove) {
    loadDoNotReplaceList(function(doNotReplaceList) {
        doNotReplaceList.sort();
        const index = doNotReplaceList.findIndex(function(s) {
            return s === urlToRemove;
        });

        // If the item hasn't already been removed from the list, remove it
        if (index !== -1) {
            doNotReplaceList.splice(index, 1);
            saveDoNotReplaceList(doNotReplaceList);
        } else {
            console.warn(urlToRemove + " was not found in `doNotReplaceList`");
        }

        // Update the displayed list
        displayDoNotReplaceList(doNotReplaceList);
    });
}

function displayDoNotReplaceList(doNotReplaceList) {
    const ul = document.getElementById("doNotReplaceList");

    // Clear listed children
    ul.innerHTML = "";

    const label = document.getElementById("turned-off-label");
    if (doNotReplaceList.length) {
        label.classList.remove("hide");
        label.classList.add("show");
    } else {
        label.classList.remove("show");
        label.classList.add("hide");
    }

    for (const url of doNotReplaceList) {
        const div = document.createElement("li");
        const deleteButton = document.createElement("span");
        deleteButton.classList.add("li-delete-button");
        deleteButton.appendChild(document.createTextNode("[x]"));
        deleteButton.addEventListener("click", function() {
            removeItem(
                this.parentElement.querySelector(".host-label").innerText
            );
        });

        const text = document.createElement("span");
        text.classList.add("host-label");
        text.appendChild(document.createTextNode(url));

        div.appendChild(text);
        div.appendChild(deleteButton);
        ul.appendChild(div);
    }
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("add").addEventListener("click", addItem);
document.getElementById("newEntry").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        addItem();
    }
});
