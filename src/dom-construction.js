//export const headerClass = "dgtw-header";
//export const buttonClass = "dgtw";
export const highlightClass = "dgtw-highlight";

// Construct HTML to implement the given highlight.
export function createWordHighlight(word) {
    return '<span class="' + highlightClass + '">' + word + "</span>";
}

// Create a header indicating text replacement status.
export function createHeader(message) {
    const element = document.createElement("section");
    element.id = "dgtw-header";
    element.innerHTML = message;
    return element;
}

// Create a button with given text and onclick function.
export function createButton(id, text, onclick) {
    const button = document.createElement("button");
    button.id = id;
    button.innerHTML = text;
    button.onclick = onclick;
    return button;
}
