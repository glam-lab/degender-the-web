/*global chrome */

/*eslint-disable */
/*
 * By Gus Perez (https://gusperez.com/wp/)
 * and David Simpson (https://davidsimpson.me/)
 * Adapted by Ian Hawkins "irhawk" for Degender the Web
 *
 * Released under the MIT license.
 *
 * More info:
 * https://gusperez.com/wp/2015/09/using-google-analytics-on-a-chrome-extension/
 */

/**
 * Reports page views and events to Google Analytics.
 * toSend should be an object with hitType, eventCategory, and eventAction
 * fields.
 * Does nothing if the user has disabled analytics.
 *
 * More info:
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/events
 */
function sendAnalytics(toSend) {
    chrome.storage.sync.get({ allowAnalytics: true }, function(data) {
        if (data.allowAnalytics) {
            (function(i, s, o, g, r, a, m) {
                i["GoogleAnalyticsObject"] = r;
                (i[r] =
                    i[r] ||
                    function() {
                        (i[r].q = i[r].q || []).push(arguments);
                    }),
                    (i[r].l = 1 * new Date());
                (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m);
            })(
                window,
                document,
                "script",
                "https://www.google-analytics.com/analytics.js",
                "ga"
            ); // Note: https protocol here
            ga("create", "UA-150966787-1", "auto");
            ga("set", "checkProtocolTask", null); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
            ga("require", "displayfeatures");
            ga("send", toSend);
        }
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.hasOwnProperty("hitType")) {
        sendAnalytics(request);
    } else {
        console.error(
            "Content script received a request with unrecognized type " +
                request.type
        );
    }
});
