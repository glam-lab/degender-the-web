var dictionary = { "underage woman" : "child",
                  "child prostitute": "rape victim",
                  "sex with minors": "rape",
                  "sex with girls": "rape",
                  "non-consensual sex": "rape"};

var elements = document.getElementsByTagName('*');

for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    for (var j = 0; j < element.childNodes.length; j++) {
        var node = element.childNodes[j];

        if (node.nodeType === 3) {
            var text = node.nodeValue;
            var phraseToReplace;
            for ( phraseToReplace in dictionary ) {
                var pattern = new RegExp('\\b(' + phraseToReplace + ')\\b', 'ig');
                var replacement = '<span style="color:red;">' + dictionary[phraseToReplace] + '</span>';
                var replacedText = text.replace(pattern, replacement);

                if (replacedText !== text) {
                    element.innerHTML = replacedText;
                }
            }
        }
    }
}
