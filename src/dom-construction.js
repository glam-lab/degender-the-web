export let replacementClass = 'dgtw-replacement';
export let headerClass = 'dgtw-header';
export let buttonClass = 'dgtw';

// Construct HTML to implement the given replacement.
// We construct raw HTML rather than DOM nodes to enable substitution using 
// the match().replace() API provided by the Compromise NLP library.
function createWordReplacement(newWord, origWord) {
    return '<span class="' + replacementClass + '"' +
                  ' onmouseover="this.innerHTML=\'' + origWord + '\';"' +
                  ' onmouseout="this.innerHTML=\'' + newWord +  '\';">' +
                  newWord + '</span>';
}

// Create a header indicating text replacement status.
function createHeader(message) {
    const element = document.createElement('section');
    element.innerHTML = message;
    element.classList.add(headerClass);
    return element;
}

// Create a button with given text and onclick function.
function createButton(text, onclick) {
    const button = document.createElement("button");
    button.innerHTML = text;
    button.onclick = onclick;
    button.classList.add(buttonClass);
    return button;
}

export { createWordReplacement, createHeader, createButton };
