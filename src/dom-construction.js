// Construct HTML to implement the given replacement.
// We construct raw HTML rather than DOM nodes to enable substitution using 
// the match().replace() API provided by the Compromise NLP library.
function createWordReplacement(newWord, origWord) {
    return '<span class="dgtw-replacement"' +
                  ' onmouseover="this.innerHTML=\'' + origWord + '\';"' +
                  ' onmouseout="this.innerHTML=\'' + newWord +  '\';">' +
                  newWord + '</span>';
}

// Create a header indicating text replacement status.
function createHeader(message) {
    let element = document.createElement('div');
    element.innerHTML = message;
    element.classList.add('dgtw-header');
    return element;
}

// Create a button with given text and onclick function.
function createButton(text, onclick) {
    let button = document.createElement("button");
    button.innerHTML = text;
    button.onclick = onclick;
    button.classList.add('dgtw');
    return button;
}

export { createWordReplacement, createHeader, createButton };
