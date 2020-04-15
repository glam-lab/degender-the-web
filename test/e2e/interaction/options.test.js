/* globals describe, before, after, it, expect, browser, storage, optionsURL, selectors */

describe("On the options page,", function() {
    let options;
    const testHosts = ["foo.net", "bar.edu", "baz.quux.com"];

    before(async function() {
        options = await browser.newPage();
        await options.goto(optionsURL);
    });

    after(async function() {
        await options.close();
    });

    it("the hosts should be listed", async function() {
        // Turn off the extension for two test hosts
        await storage.set(options, { doNotReplaceList: testHosts });
        await options.reload();

        const hosts = await options.$$eval(selectors.hostLabel, function(
            hosts
        ) {
            return hosts.map(h => h.innerHTML);
        });

        // The number of hosts shown should be the number in the list
        expect(hosts).to.have.lengthOf(3);

        // The hosts should be those in the doNotReplaceList, sorted
        expect(hosts).to.include("foo.net");
        expect(hosts).to.include("bar.edu");
        expect(hosts).to.include("baz.quux.com");
    });

    // TODO Unfinished test
    it("clicking an X should remove a host", async function() {
        await storage.set(options, { doNotReplaceList: testHosts });
        await options.reload();

        // TODO Move selector to bootstrap
        // I could get a list of li and call eval on each
        const li = await options.$$eval("#doNotReplaceList > li", function(
            items
        ) {
            return items.find(i => i.innerText.includes("bar.edu")).innerText;
        });
        console.log(li);
    });
});
