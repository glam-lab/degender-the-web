var substitute = { "she": "they",
                   "her": "them",           // But: 'her book' -> 'their book'
                   "hers": "theirs",
                   "herself": "themself",
                   "he": "they",
                   "him": "them",
                   "his": "their",          // But: 'the book is his' -> 'the book is theirs'
                   "himself": "themself" };

// Preprocess adding tooltips to replacement text
for (word in substitute) {
    substitute[word] = '<span class="degendered-pronoun">' + substitute[word] + 
                          '<span class="tooltiptext">' + word + '</span></span>';
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
    for (word in substitute) {
      doc.replace(word, substitute[word]);
    }
    let text = doc.all().out('text');
    if ((text != originalText) && (node.parentNode !== null)) {
       var element = document.createElement("span");
       element.innerHTML = text;
       node.parentNode.replaceChild(element, node);
    }
}
