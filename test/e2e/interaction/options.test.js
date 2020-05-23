/* globals describe, before, after, it, expect, browser, storage, optionsURL, selectors */

async function getListedHosts(options) {
    return options.$$eval(selectors.hostLabel, function(hosts) {
        return hosts.map(h => h.innerHTML);
    });
}

describe("On the options page,", function() {
    let options;

    const testHosts = ["bar.edu", "baz.quux.com", "foo.net"];

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
        expect(hosts).to.include("bar.edu");
        expect(hosts).to.include("baz.quux.com");
        expect(hosts).to.include("foo.net");
    });

    describe("clicking an X", function() {
        before(async function() {
            await storage.set(options, { doNotReplaceList: testHosts });
            await options.reload();

            // Click the X next to the middle item in the list
            await (await options.$$(selectors.deleteButton))[1].click();
        });

        after(async function() {
            await storage.clear(options);
        });

        it("should stop showing that item in the list", async function() {
            const labels = await options.$$eval(selectors.hostLabel, function(
                labels
            ) {
                return labels.map(label => label.innerText);
            });

            expect(labels).to.have.lengthOf(2);
            expect(labels).to.include("bar.edu");
            expect(labels).to.not.include("baz.quux.com");
            expect(labels).to.include("foo.net");
        });

        it("should remove the host from doNotReplaceList", async function() {
            const hosts = (await storage.get(options, { doNotReplaceList: [] }))
                .doNotReplaceList;

            expect(hosts).to.have.lengthOf(2);
            expect(hosts).to.include("bar.edu");
            expect(hosts).to.not.include("baz.quux.com");
            expect(hosts).to.include("foo.net");
        });
    });

    describe("turning the extension off for a host", function() {
        before(async function() {
            await storage.set(options, { doNotReplaceList: testHosts });
            await options.reload();

            // Use the field and button to add the host to the list
            await options.$eval("#newEntry", function(e) {
                e.value = "test.edu";
            });
            await (await options.$("#add")).click();
        });

        after(async function() {
            await storage.clear(options);
        });

        it("should add the URL to the list", async function() {
            const hosts = await getListedHosts(options);
            expect(hosts).to.include("test.edu");
        });

        it("should only add one URL to the list", async function() {
            const hosts = await getListedHosts(options);
            expect(hosts).to.have.lengthOf(4);
        });

        it("should clear the input field", async function() {
            expect(await options.$eval("#newEntry", e => e.value)).to.equal("");
        });
    });

    describe("turning the extension off for a URL with extra bits", function() {
        before(async function() {
            await storage.set(options, { doNotReplaceList: testHosts });
            await options.reload();

            // Use the field and button to add the host to the list
            await options.$eval("#newEntry", function(e) {
                e.value = "https://www.test.edu/foo/bar.html";
            });
            await (await options.$("#add")).click();
        });

        after(async function() {
            await storage.clear(options);
        });

        it("should strip the protocol", async function() {
            const hosts = await getListedHosts(options);
            expect(hosts).to.have.lengthOf(4);
            expect(hosts).to.include("www.test.edu");
        });
    });
});
