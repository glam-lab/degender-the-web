// Fill in words or phrases to replace.
//           "keyphrase": "replacement phrase"
var dictionary = { "kadigan": "thingamagig",
                   "Person A": "Alice", 
                   "Person B": "Bob",
                   "East Cupcake": "Podunk"};

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
        var tooltip = "Originally:"
        var chars = Math.max(tooltip.length, phraseToReplace.length + 10);
        var replacement = '<span class="tooltip">' + dictionary[phraseToReplace] + 
                              '<span class="tooltiptext" style="width:' + chars + 'ex;">' + 
                              tooltip + '<br/>"' + phraseToReplace + '"</span></span>';
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
