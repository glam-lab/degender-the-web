/*global chrome */
function restore_options() {
    chrome.storage.sync.get(
        {
            doNotReplaceList: []
        },
        function(items) {
            displayDoNotReplaceList(items.doNotReplaceList);
        }
    );
}

function addItem() {
    const newEntry = document.getElementById("newEntry").value;
    chrome.storage.sync.get(
        {
            doNotReplaceList: []
        },
        function(items) {
            items.doNotReplaceList.push(newEntry);
            items.doNotReplaceList.sort();
            chrome.storage.sync.set(items);

            // Update the displayed list
            displayDoNotReplaceList(items.doNotReplaceList);
        }
    );
}

function removeItem(urlToRemove) {
    chrome.storage.sync.get(
        {
            doNotReplaceList: []
        },
        function(items) {
            items.doNotReplaceList.sort();
            const index = items.doNotReplaceList.findIndex(function(s) {
                return s === urlToRemove;
            });

            // If the item hasn't already been removed from the list,
            if (index !== -1) {
                items.doNotReplaceList.splice(index, 1);
            }

            chrome.storage.sync.set(items);

            // Update the displayed list
            displayDoNotReplaceList(items.doNotReplaceList);
        }
    );
}

function displayDoNotReplaceList(doNotReplaceList) {
    const ul = document.getElementById("doNotReplaceList");

    // Clear listed children
    ul.innerHTML = "";

    for (const url of doNotReplaceList) {
        const div = document.createElement("li");
        const deleteButton = document.createElement("span");
        deleteButton.classList.add("delete");
        deleteButton.appendChild(document.createTextNode("x"));
        deleteButton.addEventListener("click", function() {
            removeItem(
                this.parentElement.querySelector(".url-li-label").innerText
            );
        });

        const text = document.createElement("span");
        text.classList.add("url-li-label");
        text.appendChild(document.createTextNode(url));

        div.appendChild(text);
        div.appendChild(deleteButton);
        ul.appendChild(div);
    }
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("add").addEventListener("click", addItem);
