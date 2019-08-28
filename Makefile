PACKAGE_FILES = src/*.js lib/*.js img/icon*.png $\
                degender-the-web.css manifest.json $\
                README.md PRIVACY.md
VERSION = $(shell grep '"version":' manifest.json | cut -d: -f 2 | tr -d "\"\,\ ")
ZIPFILE = dgtw-$(VERSION).zip

package: $(ZIPFILE)

$(ZIPFILE): $(PACKAGE_FILES)  
	zip -r "$(ZIPFILE)" . -i $(PACKAGE_FILES)
