Degender the Web - a Chrome extension
=====================================

Inspired by [Farhad Manjoo](https://www.nytimes.com/by/farhad-manjoo)'s essay 
[Call Me 'They'](https://www.nytimes.com/2019/07/10/opinion/pronoun-they-gender.html), 
_Degender the Web_ is a Chrome web browser extension that replaces all gendered pronouns with "they/them/their".
Thanks to Kristen Peter Mork for sharing this essay.

Gender-neutral pronouns added by this extension will appear with a faint dashed underline. Mouse over to see a tooltip containing the original, gendered pronoun.

Over time, the singular "they", which is preferred by many people, should feel more natural in reading, writing, and speech.

Background
==========

This Chrome extension is also inspired by earlier word-replacement extensions such as 
[Honest Chrome](http://untitledscience.github.io/HonestChrome/), 
which replaces the body-shaming words "skinny", "slim", and "thin" with body-positive words 
"fit", "toned", and "healthy".

For a review of technology designed to influence language use, see this prior work:

>Emma Twersky and Janet Davis. 
>["Don't say that!" An analysis of persuasive systems in the wild.](http://cs.whitman.edu/~davisj/pubs/Persuasive2017_031_final.pdf)
>In de Vries, P.W., Oinas-Kukkonen, H., Siemons, L., Beerlage-de Jong, N., van Gemert-Pijnen, L. (Eds.), _Proceedings of the 12th International Conference on Persuasive Technology (PERSUASIVE 2017)_, Amsterdam, The Netherlands, April 4-6, 2017. Springer, LNCS 10171, pages 215-226.

Contributing
============

If you encounter a bug or think of a suggestion, please [create a GitHub issue](https://github.com/janetlndavis/degender-the-web/issues/new) with your request.

If you're a developer, you're welcome to submit a pull request.

Development Setup
-----------------
  * Fork this repository.
  * `git clone`
  * Follow the [instructions on the Chrome docs](https://developer.chrome.com/extensions/getstarted#unpacked) to load the extension.
  * Test on a web page such as [this list of pronouns](http://www.english-language-grammar-guide.com/list-of-pronouns.html).
  * If you make changes to the code, click the Reload link on the `chrome://extensions` page and then reload pages to pick up the changes.
  * Errors will show up in the console.
  
### To Publish a New Version to Chrome Webstore
  1. Make sure all the tests pass.
  1. Update the version number in `manifest.json` and commit the change to master.
     Use [semantic versioning](http://semver.org/) to determine how to increment the version number
  1. Run the `package.sh` shell script to generate a zip file
  1. Go to [Chrome Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard) and edit the existing app. Upload the new zip file and then publish the changes (button is at the very bottom)
  1. Tag the new release in [GitHub](https://github.com/janetlndavis/degender-the-web/releases) and include release notes  
