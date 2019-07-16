var dictionary = { "she": "they",
                   "her": "them",           // But: 'her book' -> 'their book'
                   "hers": "theirs",
                   "herself": "themself",
                   "he": "they",
                   "him": "them",
                   "his": "their",          // But: 'the book is his' -> 'the book is theirs'
                   "himself": "themself" };

function wrap(newWord, origWord) {
    return '<span class="replacement" onmouseover="this.innerHTML=\'' + origWord + '\';"' +
                                    ' onmouseout="this.innerHTML=\'' + newWord +  '\';">' +
                  newWord + '</span>';
}

function titleCase(word) {
    return word[0].toUpperCase() + word.slice(1);
}

// Preprocess adding tooltips to replacement text. with title case variants
let substitute = {};
let capitalizers = [ titleCase, str => str.toUpperCase(), x => x.toLowerCase() ];
for (word in dictionary) {
    for (f of capitalizers) {
        substitute[f(word)] = wrap(f(dictionary[word]), f(word));
    }
}

// TreeWalker did not behave as I expected, so we'll do it with explicit recursion.
function textNodesUnder(node){
  var all = [];
  for (node=node.firstChild;node;node=node.nextSibling){
    if (node.nodeType==3) all.push(node);
    else all = all.concat(textNodesUnder(node));
  }
  return all;
}

var textNodes = textNodesUnder(document.body);

for (node of textNodes) {
    var originalText = node.nodeValue;
    let doc = nlp(originalText);
    for (word in dictionary) {
      matches = doc.match(word);
      matches.match("#TitleCase").replaceWith(substitute[titleCase(word)]);
      matches.match("#Acronym").replaceWith(substitute[word.toUpperCase()]);
      matches.not("#TitleCase").not("#Acronym").replaceWith(substitute[word]);
    }
    let text = doc.all().out('text');
    if ((text != originalText) && (node.parentNode !== null)) {
       var element = document.createElement("span");
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

