all: src/excluded-domains.js

src/excluded-domains.js: src/excluded-domains.js.pp excluded-domains.json
	cpp -P $< > $@

realclean: 
	rm src/excluded-domains.js
