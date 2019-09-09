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
                descr: "Possessive noun",
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
                descr: "Possessive noun",
                in: "The book is his",
                out: "The book is theirs"
            },
            {
                descr: "Reflexive",
                in: "He did it himself",
                out: "They did it themself"
            }
        ]
    }
};
