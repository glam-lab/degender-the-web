GENERATED_JS = src/excluded-domains.js src/personal-pronoun-specs.js
PACKAGE_FILES = src/*.js lib/*.js $\
                degender-the-web.css manifest.json $\
                README.md PRIVACY.md
VERSION = $(shell grep '"version":' manifest.json | cut -d: -f 2 | tr -d "\"\,\ ")
ZIPFILE = dgtw-$(VERSION).zip

package: $(ZIPFILE)

$(ZIPFILE): $(GENERATED_JS) $(PACKAGE_FILES)  
	zip -r "$(ZIPFILE)" . -i $(PACKAGE_FILES)

all: $(GENERATED_JS)

src/%.js: src/%.pp.js data/%.json
	cpp -P $< > $@

realclean: 
	rm $(GENERATED_JS) dgtw*.zip
