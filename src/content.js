var dictionary = { "she": "they",
                   "her": "them",           // But: 'her book' -> 'their book'
                   "hers": "theirs",
                   "herself": "themself",
                   "he": "they",
                   "him": "them",
                   "his": "their",          // But: 'the book is his' -> 'the book is theirs'
                   "himself": "themself" };

// Capitalize the first letter of the given string
function titleCase(word) {
    return word[0].toUpperCase() + word.slice(1);
}

// Construct HTML to implement the given replacement.
// We construct raw HTML rather than DOM nodes to enable text substitution using 
// the match().replace() API provided by the Compromise NLP library
function wrap(newWord, origWord) {
    return '<span class="replacement" onmouseover="this.innerHTML=\'' + origWord + '\';"' +
                                    ' onmouseout="this.innerHTML=\'' + newWord +  '\';">' +
                  newWord + '</span>';
}

// Preprocess adding tooltips to replacement text, with title case variants
let substitute = {};
let capitalizers = [ titleCase, str => str.toUpperCase(), x => x.toLowerCase() ];
for (word in dictionary) {
    for (f of capitalizers) {
        substitute[f(word)] = wrap(f(dictionary[word]), f(word));
    }
}

// Collect in a list all text nodes under an element el
// Source: https://stackoverflow.com/questions/10730309/find-all-text-nodes-in-html-page
function textNodesUnder(el){
  let n=null, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  while(n=walk.nextNode()) a.push(n);
  return a;
}

// Construct a regex to quickly tell if a text node contains any keywords.
let regexp = new RegExp(Object.keys(dictionary).join('|'), "i");

// The core algorithm: If a text node contains one or more keywords, 
// create new nodes containing the substitute text and the surrounding text.
// We collect all nodes in a list before processing them because modification 
// in place seems to disrupt the TreeWalker traversal.
let textNodes = textNodesUnder(document.body);
for (node of textNodes) {
    let originalText = node.nodeValue;

    // Apply NLP only if the original text contains at least one keyword.
    if (regexp.test(originalText)) {
        let doc = nlp(originalText);
        for (word in dictionary) {
            if (doc.has(word)) {
                // Replace matching words while preserving text.
                matches = doc.match(word);
                matches.match("#TitleCase").replaceWith(substitute[titleCase(word)]);
                matches.match("#Acronym").replaceWith(substitute[word.toUpperCase()]);
                matches.not("#TitleCase").not("#Acronym").replaceWith(substitute[word]);
            }
        }
        
        // Glean and insert the replacement text.
        let text = doc.all().out('text');
        let element = document.createElement("span");
        element.innerHTML = text;
        node.parentNode.replaceChild(element, node);
    }
}

// Fix the width of all "replacement" spans so the text does not reflow
// when the node content is replaced. 
// (This relies on the observation than "they/them/their" is longer than
// "he/him/his" or "she/her/her".)
let replacementNodes = document.getElementsByClassName("replacement");
for (node of replacementNodes) {
    let width = node.offsetWidth;    // Find the node's width as rendered.
    node.style.width = width + "px"; // Set the width explicitly in its style.
}

