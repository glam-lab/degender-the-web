module.exports.cases = {
    "Pronoun forms": {
        Feminine: [
            {
                descr: "Subject",
                in: "She will leave",
                out: "They will leave"
            },
            {
                descr: "Object",
                in: "I like her",
                out: "I like them"
            },
            {
                descr: "Possessive adjective",
                in: "It is her book",
                out: "It is their book"
            },
            {
                descr: "Possessive adjective with more adjectives",
                in: "It is her large green book",
                out: "It is their large green book"
            },
            {
                descr: "Object with possessive adjective",
                in: "I let her borrow my suitcase for her trip",
                out: "I let them borrow my suitcase for their trip",
                pending: 93
            },
            {
                descr: "Possessive pronoun",
                in: "The book is hers",
                out: "The book is theirs"
            },
            {
                descr: "Reflexive",
                in: "She did it herself",
                out: "They did it themself"
            }
        ],
        Masculine: [
            {
                descr: "Subject",
                in: "He will leave",
                out: "They will leave"
            },
            {
                descr: "Object",
                in: "I like him",
                out: "I like them"
            },
            {
                descr: "Possessive adjective",
                in: "It is his book",
                out: "It is their book"
            },
            {
                descr: "Possessive pronoun",
                in: "We can take his",
                out: "We can take theirs"
            },
            {
                descr: "Possessive noun followed by 'is'",
                in: "His is better",
                out: "Theirs is better",
                pending: 93
            },
            {
                descr: "Possessive noun followed by semicolon",
                in: "We can take his; mine is in the shop",
                out: "We can take theirs; mine is in the shop"
            },
            {
                descr: "Possessive noun followed by dash",
                in: "We can take his - mine is in the shop",
                out: "We can take theirs - mine is in the shop"
            },
            {
                descr: "Possessive adjective with possessive noun",
                in: "His things are his",
                out: "Their things are theirs"
            },
            {
                descr: "Reflexive",
                in: "He did it himself",
                out: "They did it themself"
            }
        ]
    }
};
