var dictionary = { "she": "they",
                   "her": "them",           // But: 'her book' -> 'their book'
                   "hers": "theirs",
                   "herself": "themself",
                   "he": "they",
                   "him": "them",
                   "his": "their",          // But: 'the book is his' -> 'the book is theirs'
                   "himself": "themself" };

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
    var text = originalText;
    for (phraseToReplace in dictionary) {
        var pattern = new RegExp('\\b(' + phraseToReplace + ')\\b', 'ig');
        var replacement = '<span class="degendered-pronoun">' + 
                              dictionary[phraseToReplace] + 
                              '<span class="tooltiptext">' +
                              phraseToReplace + '</span></span>';
        var replacedText = text.replace(pattern, replacement);

        if ((replacedText !== text) && (node.parentNode !== null)) {
          text = replacedText;
        }
    }
    if ((text != originalText) && (node.parentNode !== null)) {
       var element = document.createElement("span");
       element.innerHTML = text;
       node.parentNode.replaceChild(element, node);
    }
}
