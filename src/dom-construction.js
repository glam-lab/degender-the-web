export const appStyleClass = "dgtw";

// Functor that makes a function to wrap given content in an HTML tag
function makeTagger(tag) {
    const open = "<" + tag + " class='" + appStyleClass + " hide'>";
    const close = "</" + tag + ">";
    return function(content) {
        return open + content + close;
    };
}

export const ins = makeTagger("ins");
export const del = makeTagger("del");
export const highlight = makeTagger("strong");
