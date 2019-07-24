all: src/excluded-domains.js

src/excluded-domains.js: src/excluded-domains.pp.js excluded-domains.json
	cpp -P $< > $@

realclean: 
	rm src/excluded-domains.js
