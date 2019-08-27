export const headerClass = 'dgtw-header';
export const buttonClass = 'dgtw';
export const replacementClass = 'dgtw-replacement';
export const highlightClass = 'dgtw-highlight';

// Construct HTML to implement the given replacement.
// We construct raw HTML rather than DOM nodes to enable substitution using 
// the match().replace() API provided by the Compromise NLP library.
export function createWordReplacement(newWord, origWord) {
    return '<span class="' + replacementClass + '"' +
                  ' onmouseover="this.innerHTML=\'' + origWord + '\';"' +
                  ' onmouseout="this.innerHTML=\'' + newWord +  '\';">' +
                  newWord + '</span>';
}

// Construct a span tag to implement the given replacement.
// DELETE unused code
export function getReplacementSpanTag(newWord, origWord) {
    return '<span class="' + replacementClass + '"' +
                  ' onmouseover="this.innerHTML=\'' + origWord + '\';"' +
                  ' onmouseout="this.innerHTML=\'' + newWord +  '\';">';
}

// Construct a span tag to implement the given highlight.
// DELETE unused code
export function getHighlightSpanTag(word) {
    return '<span class ="'+highlightClass+'">';
}

// Construct HTML to implement the given highlight.
export function createWordHighlight(word) {
    return '<span class="'+highlightClass+'">'+word+'</span>';
}

// Create a header indicating text replacement status.
export function createHeader(message) {
    const element = document.createElement('section');
    element.innerHTML = message;
    element.classList.add(headerClass);
    return element;
}

// Create a button with given text and onclick function.
export function createButton(text, onclick) {
    const button = document.createElement("button");
    button.innerHTML = text;
    button.onclick = onclick;
    button.classList.add(buttonClass);
    return button;
}
