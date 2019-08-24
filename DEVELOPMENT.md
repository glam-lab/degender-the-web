# Information for developers

If you're a developer, you are welcome to submit a pull request. However, if you are not responding to an [existing issue](https://github.com/ProfJanetDavis/degender-the-web/issues), please [submit an issue](https://github.com/ProfJanetDavis/degender-the-web/issues/new) for discussion prior to implementation.

Read about [trans-inclusive design](https://alistapart.com/article/trans-inclusive-design) before contributing.
See the [wiki](https://github.com/ProfJanetDavis/degender-the-web/wiki) for additional technical and design notes.

## Development setup

-   Fork this repository, then run `git clone`.
-   Install [Node.js](https://nodejs.org/en/download/), if needed, then run `npm install`.
-   Follow the [Chrome documentation](https://developer.chrome.com/extensions/getstarted#unpacked) to load the extension.
-   Open the file `test.html` in a Web browser to review the provided end-to-end test cases.
-   Ensure Chrome is your default Web browser, then
    - Run `make test` to run automated tests, first ensuring that Chrome is your default Web browser.
    - Run `make test-e2e` to review end-to-end test cases.
-   If you make changes to any code, click the Reload link on the `chrome://extensions` page and then reload pages to pick up the changes. Reload test pages using **Shift-Command-R**.
-   Errors will show up in the [console](https://developers.google.com/web/tools/chrome-devtools/console/).

## To publish a new version to the Chrome Webstore

1. Make sure all the tests pass.
1. Update the version number in `manifest.json` and `package.json`. Commit the change to master.
   Use [semantic versioning](http://semver.org/) to determine how to increment the version number.
1. Run `make package` to build a new zip file named `dgtw-VERSION.zip`.
1. Go to [Chrome Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard) and edit the existing app. Upload the new zip file and then publish the changes. (The button is at the very bottom.)
    - Because this Chrome extension uses content scripts, it is subject to human review. Thus publication may be "pending review" for several days.
1. Tag the new release in [GitHub](https://github.com/glam-lab/degender-the-web/releases) and include release notes.
