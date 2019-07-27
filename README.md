# Degender the Web - a Chrome extension
What if English had no gender pronouns? 
Inspired by [Farhad Manjoo](https://www.nytimes.com/by/farhad-manjoo)'s essay 
[It's Time for 'They'](https://www.nytimes.com/2019/07/10/opinion/pronoun-they-gender.html), 
_Degender the Web_ is a Chrome web browser extension that replaces gendered personal pronouns on most Web pages with "they/them/their".

_Degender the Web_ is both a thought experiment and a behavior change support system.
When you install it, you will see how the singular "they" can function as a universal pronoun.
As you use it over time, you should become more comfortable with the singular "they" in reading, writing, and speech. 

Gender-neutral pronouns added by this extension will appear with a faint dashed underline. 
Mouse over to see the original, gendered pronoun. 
Text that you write or edit, e.g., in a form or on Google Docs, will not be modified.
The original text can be restored with the click of a button.

Note that this extension runs the risk of misgendering persons, both trans and cis, 
who have stated their use of "he/him" or "she/her" prounouns. 
Though it can never be eliminated entirely, several design features will aim to mitigate that risk. In particular:

* If a page includes a specification of personal pronouns [such as "he/him" or "she/her"](data/personal-pronoun-specs.json),
  those specifications will be highlighted and other pronouns will not be changed.
  
Other potential features are currently documented as [issues](https://github.com/ProfJanetDavis/degender-the-web/issues) 
and will be documented here when they are implemented. 
See also the invitation to contribute below.

[A few sites](data/excluded-domains.json) are excluded due to technical incompatibilities.

## Learning more

To learn more, read some of the following contributed links:
* [Understanding Non-Binary People: How to be Respectful and Supportive](https://transequality.org/issues/resources/understanding-non-binary-people-how-to-be-respectful-and-supportive) - A very concise guide provided by the National Center for Transgender Equality.
* [What is the Singular They, and Why Should I Use it?](https://www.grammarly.com/blog/use-the-singular-they/) - An accessible introduction published on the Grammarly Blog.
* [I'm With 'They'](https://www.nytimes.com/2019/07/12/opinion/gender-neutral-pronouns.html) - Farhad Manjoo responds to reader comments, including many common objections.
* [Why We Should All Use They/Them Pronouns](https://blogs.scientificamerican.com/voices/why-we-should-all-use-they-them-pronouns/) - An argument for the stronger claim that we should do away with gendered pronouns altogether.
* [Actually, We Should _Not_ All Use They/Them Pronouns](https://blogs.scientificamerican.com/voices/actually-we-should-not-all-use-they-them-pronouns/) - A response to the above, by "a mix of queer, nonwhite, non-American, bicultural, trans people."
* [Pronoun Privilege](https://www.nytimes.com/2016/09/26/opinion/pronoun-privilege.html) - An essay on pronoun use in the classroom.
* [A Quick and Easy Guide to They/Them Pronouns](https://www.archiebongiovanni.com/A-Quick-And-Easy-Guide-To-They-Them-Pronouns) - An educational comic book!
* [The Radical Copyeditor's Style Guide for Writing about Transgender People](https://radicalcopyeditor.com/2017/08/31/transgender-style-guide/) - A careful guide to usage in the U.S. context.
* [They Is My Pronoun](http://www.theyismypronoun.com/) - "TIMP focuses on actually using singular they in real life, and on enabling the choice to use gender-neutral pronouns for yourself or for others."


For a review of technology designed to influence language use, see this prior work:

>Emma Twersky and Janet Davis. 
>["Don't say that!" An analysis of persuasive systems in the wild.](http://cs.whitman.edu/~davisj/pubs/Persuasive2017_031_final.pdf)
>In de Vries, P.W., Oinas-Kukkonen, H., Siemons, L., Beerlage-de Jong, N., van Gemert-Pijnen, L. (Eds.), _Proceedings of the 12th International Conference on Persuasive Technology (PERSUASIVE 2017)_, Amsterdam, The Netherlands, April 4-6, 2017. Springer, LNCS 10171, pages 215-226.

## Contributing

Contributions from the community are welcome. Please [create a GitHub issue](https://github.com/ProfJanetDavis/degender-the-web/issues/new/choose):
* if you identify situations in which the singular pronoun 'they' is conjugated incorrectly;
* if you identify a site on which this extension should not run;
* if you encounter other unexpected behavior (bugs) while using this extension;
* if you have suggestions for additional features.

Developers are welcome to submit a pull request. See [information for developers](DEVELOPMENT.md).

## Acknowledgments

Thanks to Kristen Peter Mork for sharing Farhad Manjoo's essay. Thanks also to Sarah Peterson, Ellie Poley, and Syd Ryan for contributing to the links listed above. Thanks to all of the preceding for conversations about this project. (Additional acknowledgments will be added as permissions are obtained.)

This work is supported by [Whitman College](https://www.whitman.edu/) and the Microsoft Chair in Computer Science. Thanks to Gillian Frew for assisting with media strategy. 

This Chrome extension is inspired by earlier text replacement extensions such as 
[HonestChrome](http://untitledscience.github.io/HonestChrome/).
