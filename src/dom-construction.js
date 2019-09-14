export const appStyleClass = "dgtw";

// Functor that makes a function to wrap given content in an HTML tag
function makeTagger(tag) {
    const open = "<" + tag + " class='" + appStyleClass + " hide'>";
    const close = "</" + tag + ">";
    return function(content) {
        return open + content + close;
    };
}

export const ins = makeTagger("ins");
export const del = makeTagger("del");
export const highlight = makeTagger("strong");

// Create a header indicating text replacement status.
export function createHeader(id, message) {
    const element = document.createElement("section");
    element.id = id;
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
