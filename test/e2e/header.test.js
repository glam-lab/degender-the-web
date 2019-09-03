/*globals describe, before, after, it, browser */

describe("Header", function() {
    let page;

    before(async function() {
        page = await browser.newPage();
        await page.goto("http://localhost:8080/test/html/e2e-helper.html");
    });

    after(async function() {
        await page.close();
    });

    it("should be present", async function() {
        await page.waitFor(".dgtw-header");
    });
    it("should be the first element in the body");
    it("should contain a dismiss button");
    it("should contain a restore button");
    it("should have some text outside the buttons");
    it("should say when the domain is excluded");
    it("should say when personal pronoun specs are found");
    it("should say when the word 'gender' is found");
    it("should say when pronouns are changed");
    it("should say when no pronouns are found");
});
