# Degender the Web - a Chrome extension

Inspired by [Farhad Manjoo](https://www.nytimes.com/by/farhad-manjoo)'s essay 
[It's Time for 'They'](https://www.nytimes.com/2019/07/10/opinion/pronoun-they-gender.html), 
_Degender the Web_ is a Chrome web browser extension that replaces all gendered pronouns with "they/them/their".

Gender-neutral pronouns added by this extension will appear with a faint dashed underline. Mouse over to see 
the original, gendered pronoun.

Over time, the singular "they", which is preferred by many people, should feel more natural in reading, writing, and speech.

## Additional resources

To learn more, you may wish to read:
* [Understanding Non-Binary People: How to be Respectful and Supportive](https://transequality.org/issues/resources/understanding-non-binary-people-how-to-be-respectful-and-supportive) - A very concise guide provided by the National Center for Transgender Equality.F
* [I'm With 'They'](https://www.nytimes.com/2019/07/12/opinion/gender-neutral-pronouns.html) - Farhad Manjoo responds to reader comments, including many common objections.
* [Why We Should All Use They/Them Pronouns](https://blogs.scientificamerican.com/voices/why-we-should-all-use-they-them-pronouns/) - An argument for the stronger claim that we should do away with gendered pronouns altogether.
* [Actually, We Should _Not_ All Use They/Them Pronouns](https://blogs.scientificamerican.com/voices/actually-we-should-not-all-use-they-them-pronouns/) - An argument that we should continue to use gendered pronouns.
* [Pronoun Privilege](https://www.nytimes.com/2016/09/26/opinion/pronoun-privilege.html) - An essay on pronoun use in the classroom.
* [A Quick and Easy Guide to They/Them Pronouns](https://www.archiebongiovanni.com/A-Quick-And-Easy-Guide-To-They-Them-Pronouns) - An educational comic book!
* [They Is My Pronoun](http://www.theyismypronoun.com/) - "TIMP focuses on actually using singular they in real life, and on enabling the choice to use gender-neutral pronouns for yourself or for others."

For a review of technology designed to influence language use, see this prior work:

>Emma Twersky and Janet Davis. 
>["Don't say that!" An analysis of persuasive systems in the wild.](http://cs.whitman.edu/~davisj/pubs/Persuasive2017_031_final.pdf)
>In de Vries, P.W., Oinas-Kukkonen, H., Siemons, L., Beerlage-de Jong, N., van Gemert-Pijnen, L. (Eds.), _Proceedings of the 12th International Conference on Persuasive Technology (PERSUASIVE 2017)_, Amsterdam, The Netherlands, April 4-6, 2017. Springer, LNCS 10171, pages 215-226.

## Acknowledgments

Thanks to Kristen Peter Mork for sharing Farhad Manjoo's essay. Thanks to many others for providing links (some names to appear soon). 

This Chrome extension is inspired by earlier Web browser extensions such as 
[HonestChrome](http://untitledscience.github.io/HonestChrome/), 
which replaces the "body-shaming" words "skinny", "slim", and "thin" with body-positive words 
"fit", "toned", and "healthy".

This work is supported by [Whitman College](https://www.whitman.edu/) and the Microsoft Chair in Computer Science. Thanks to Gillian Frew for assisting with media strategy. 

## Contributing

If you encounter a bug or think of a suggestion, please [create a GitHub issue](https://github.com/janetlndavis/degender-the-web/issues/new) with your request.

If you're a developer, you're welcome to submit a pull request.

### Development setup
  * Fork this repository.
  * `git clone`
  * Follow the [instructions on the Chrome docs](https://developer.chrome.com/extensions/getstarted#unpacked) to load the extension.
  * If you make changes to the code, click the Reload link on the `chrome://extensions` page and then reload pages to pick up the changes.
  * Open the file ```test.html``` in a Web browser to review the provided test cases.
  * Errors will show up in the console.
  
### Automated tests
Automated tests in Jasmine are [forthcoming](https://github.com/janetlndavis/degender-the-web/issues/2).

### To publish a new version to the Chrome Webstore
_Note: Version 1.0 has not been released. This extension has not yet been published._
  1. Make sure all the tests pass.
  1. Update the version number in `manifest.json` and commit the change to master.
     Use [semantic versioning](http://semver.org/) to determine how to increment the version number
  1. Run the `package.sh` shell script to generate a zip file
  1. Go to [Chrome Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard) and edit the existing app. Upload the new zip file and then publish the changes (button is at the very bottom)
  1. Tag the new release in [GitHub](https://github.com/janetlndavis/degender-the-web/releases) and include release notes  
