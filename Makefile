PACKAGE_FILES = src/*.js lib/*.js data/*.js img/icon*.png $\
                degender-the-web.css manifest.json $\
                README.md PRIVACY.md LICENSE
VERSION = $(shell grep '"version":' manifest.json | cut -d: -f 2 | tr -d "\"\,\ ")
ZIPFILE = dgtw-$(VERSION).zip

TEST_PORT = 8888

package: $(ZIPFILE)

$(ZIPFILE): $(PACKAGE_FILES)  
	zip -r "$(ZIPFILE)" . -i $(PACKAGE_FILES)

test-e2e:
	open file://$(shell pwd)/test.html

test: run-server open-mocha

open-mocha:
	open http://localhost:$(TEST_PORT)/mocha/

run-server: 
	python3 -m http.server $(TEST_PORT) &	

kill-server:
	ps ax | grep 'python3 -m http.server $(TEST_PORT)' | grep -e 'grep' | cut -d' ' -f 1 | xargs kill
