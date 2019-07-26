all: src/excluded-domains.js

src/%.js: src/%.pp.js data/%.json
	cpp -P $< > $@

realclean: 
	rm src/excluded-domains.js
