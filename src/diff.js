/*eslint eqeqeq: "off" */
/*
 * Javascript Diff Algorithm
 *  By John Resig (http://ejohn.org/)
 *  Modified by Chu Alan "sprite"
 *  Adapted by Janet Davis "ProfJanetDavis" for Degender the Web
 *
 * Released under the MIT license.
 *
 * More Info:
 *  http://ejohn.org/projects/javascript-diff-algorithm/
 */

function escape(s) {
    let n = s;
    n = n.replace(/&/g, "&amp;");
    n = n.replace(/</g, "&lt;");
    n = n.replace(/>/g, "&gt;");
    n = n.replace(/"/g, "&quot;");
    return n;
}

function ins(s) {
    return "<ins class='dgtw'>" + s + "</ins>";
}

function del(s) {
    return "<del class='dgtw'>" + s + "</del>";
}

export function diffString(o, n) {
    o = o.replace(/\s+$/, "");
    n = n.replace(/\s+$/, "");

    const out = diff(
        o == "" ? [] : o.split(/\s+/),
        n == "" ? [] : n.split(/\s+/)
    );
    let str = "";

    let oSpace = o.match(/\s+/g);
    if (oSpace == null) {
        oSpace = ["\n"];
    } else {
        oSpace.push("\n");
    }

    let nSpace = n.match(/\s+/g);
    if (nSpace == null) {
        nSpace = ["\n"];
    } else {
        nSpace.push("\n");
    }

    if (out.n.length == 0) {
        for (let i = 0; i < out.o.length; i++) {
            str += del(escape(out.o[i]) + oSpace[i]);
        }
    } else {
        if (out.n[0].text == null) {
            for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
                str += del(escape(out.o[n]) + oSpace[n]);
            }
        }

        for (let i = 0; i < out.n.length; i++) {
            if (out.n[i].text == null) {
                str += ins(escape(out.n[i]) + nSpace[i]);
            } else {
                let pre = "";

                for (
                    n = out.n[i].row + 1;
                    n < out.o.length && out.o[n].text == null;
                    n++
                ) {
                    pre += del(escape(out.o[n]) + oSpace[n]);
                }
                str += " " + out.n[i].text + nSpace[i] + pre;
            }
        }
    }

    return str;
}

function diff(o, n) {
    const ns = new Object();
    const os = new Object();
    let i;

    for (i = 0; i < n.length; i++) {
        if (ns[n[i]] == null) ns[n[i]] = { rows: new Array(), o: null };
        ns[n[i]].rows.push(i);
    }

    for (i = 0; i < o.length; i++) {
        if (os[o[i]] == null) os[o[i]] = { rows: new Array(), n: null };
        os[o[i]].rows.push(i);
    }

    for (i in ns) {
        if (
            ns[i].rows.length == 1 &&
            typeof os[i] != "undefined" &&
            os[i].rows.length == 1
        ) {
            n[ns[i].rows[0]] = { text: n[ns[i].rows[0]], row: os[i].rows[0] };
            o[os[i].rows[0]] = { text: o[os[i].rows[0]], row: ns[i].rows[0] };
        }
    }

    for (i = 0; i < n.length - 1; i++) {
        if (
            n[i].text != null &&
            n[i + 1].text == null &&
            n[i].row + 1 < o.length &&
            o[n[i].row + 1].text == null &&
            n[i + 1] == o[n[i].row + 1]
        ) {
            n[i + 1] = { text: n[i + 1], row: n[i].row + 1 };
            o[n[i].row + 1] = { text: o[n[i].row + 1], row: i + 1 };
        }
    }

    for (i = n.length - 1; i > 0; i--) {
        if (
            n[i].text != null &&
            n[i - 1].text == null &&
            n[i].row > 0 &&
            o[n[i].row - 1].text == null &&
            n[i - 1] == o[n[i].row - 1]
        ) {
            n[i - 1] = { text: n[i - 1], row: n[i].row - 1 };
            o[n[i].row - 1] = { text: o[n[i].row - 1], row: i - 1 };
        }
    }

    return { o: o, n: n };
}
