// See https://www.englishpage.com/verbpage/
// Not all verb forms are represented here, but I think I got the ones likely to make trouble.

module.exports.cases = {
    "Verb tenses": {
        Simple: {
            Present: [
                {
                    descr: "Regular verb",
                    in: "She speaks English",
                    out: "They speak English",
                    pending: 8
                },
                {
                    descr: "Regular with adverb",
                    in: "She only speaks English",
                    out: "They only speak English",
                    pending: 8
                },
                {
                    descr: "Do, statement",
                    in: "She does not speak English",
                    out: "They do not speak English",
                    pending: 8
                },
                {
                    descr: "Do, question",
                    in: "Does she speak English?",
                    out: "Do they speak English?",
                    pending: 8
                },
                {
                    descr: "Be",
                    in: "She is happy",
                    out: "They are happy",
                    pending: 8
                },
                {
                    descr: "Have",
                    in: "She has a book",
                    out: "They have a book",
                    pending: 8
                },
                { descr: "Modal", in: "She should go", out: "They should go" }
            ],
            Past: [
                {
                    descr: "Regular verb",
                    in: "She traveled to Japan",
                    out: "They traveled to Japan"
                },
                {
                    descr: "Irregular verb",
                    in: "She saw many things",
                    out: "They saw many things"
                }
            ],
            Future: [
                {
                    descr: "Will",
                    in: "She will travel to Japan",
                    out: "They will travel to Japan"
                },
                {
                    descr: "Be going to",
                    in: "She is going to travel to Japan",
                    out: "They are going to travel to Japan",
                    pending: 8
                }
            ]
        },
        Continuous: [
            {
                descr: "Present",
                in: "She is reading a book",
                out: "They are reading a book",
                pending: 8
            },
            {
                descr: "Past",
                in: "She was reading a book",
                out: "They were reading a book",
                pending: 8
            },
            {
                descr: "Future",
                in: "She will be waiting",
                out: "They will be waiting"
            }
        ],
        Perfect: [
            {
                descr: "Present",
                in: "She has been reading a book",
                out: "They have been reading a book",
                pending: 8
            },
            {
                descr: "Past",
                in: "She had been reading a book",
                out: "They had been reading a book"
            },
            {
                descr: "Future",
                in: "She will have left",
                out: "They will have left"
            }
        ]
    }
};
