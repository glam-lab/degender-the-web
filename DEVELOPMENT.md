# Information for developers

If you're a developer, you are welcome to submit a pull request. However, if you are not responding to an [existing issue](https://github.com/ProfJanetDavis/degender-the-web/issues), please [submit an issue](https://github.com/ProfJanetDavis/degender-the-web/issues/new) for discussion prior to implementation.

Read about [trans-inclusive design](https://alistapart.com/article/trans-inclusive-design) before contributing.

## Development setup
  * Fork this repository.
  * `git clone`
  * Follow the [Chrome documentation](https://developer.chrome.com/extensions/getstarted#unpacked) to load the extension.
  * Run `make all` to produce generated files.
  * If you make changes to the code, click the Reload link on the `chrome://extensions` page and then reload pages to pick up the changes.
  * Open the file ```test.html``` in a Web browser to review the provided end-to-end test cases.
  * Errors will show up in the console.
  
## Automated tests
Automated tests in Jasmine are [forthcoming](https://github.com/janetlndavis/degender-the-web/issues/2).

## To publish a new version to the Chrome Webstore
_Note: Version 1.0 has not been released. This extension has not yet been published._
  1. Make sure all the tests pass.
  1. Update the version number in `manifest.json` and commit the change to master.
     Use [semantic versioning](http://semver.org/) to determine how to increment the version number.
  1. Run the [forthcoming `package.sh` shell script](https://github.com/ProfJanetDavis/degender-the-web/issues/19) to generate a zip file.
  1. Go to [Chrome Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard) and edit the existing app. Upload the new zip file and then publish the changes. (The button is at the very bottom.)
  1. Tag the new release in [GitHub](https://github.com/janetlndavis/degender-the-web/releases) and include release notes.
