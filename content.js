var dictionary = { "underage woman" : "child",
                   //"underage women" : "children",
                   "child prostitute": "rape victim",
                   "sex with minors": "rape",
                   "sex with children": "rape",
                   "sex with girls": "rape",
                   "non-consensual sex": "rape"};

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
    var text = node.nodeValue;
    for (phraseToReplace in dictionary) {
        var pattern = new RegExp('\\b(' + phraseToReplace + ')\\b', 'ig');
        var replacement = '<span class="tooltip">' + dictionary[phraseToReplace] + 
                              '<span class="tooltiptext">Was: "' + phraseToReplace + '"</span></span>';
        var replacedText = text.replace(pattern, replacement);

        if ((replacedText !== text) && (node.parentNode !== null)) {
          node.parentNode.innerHTML = replacedText;
        }
    }
}
