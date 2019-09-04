/*globals describe, it */

/* Ideally, we should test accessing a page in an excluded domain, such as facebook.com. However, that requires actually loading the extension, which I have not managed to do successfully. These pending tests are here as a placeholder to remind us this use case is not tested. */

describe("When the page is in an excluded domain, it", function() {
    it("should load the Chrome extension");
    it("should not change the text");
    it("should explain in the header");
});
