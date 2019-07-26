GENERATED_JS = src/excluded-domains.js src/personal-pronoun-specs.js

all: $(GENERATED_JS)

src/%.js: src/%.pp.js data/%.json
	cpp -P $< > $@

realclean: 
	rm $(GENERATED_JS)
