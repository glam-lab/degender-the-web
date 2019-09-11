// See https://www.englishpage.com/verbpage/
// Not all verb forms are represented here, but I think I got the ones likely to make trouble.

export const verbTenses = {
    "Verb tenses": {
        Simple: {
            Present: [
                {
                    descr: "Regular verb",
                    in: "She speaks English",
                    out: "They speak English"
                },
                {
                    descr: "Regular with adverb",
                    in: "He only speaks English",
                    out: "They only speak English"
                },
                {
                    descr: "Do statement",
                    in: "She does not speak English",
                    out: "They do not speak English"
                },
                {
                    descr: "Do question",
                    in: "Does he speak English?",
                    out: "Do they speak English?"
                },
                {
                    descr: "Do question, negated",
                    in: "Doesn't she speak English?",
                    out: "Do they not speak English?"
                },

                {
                    descr: "Be statement",
                    in: "He is happy",
                    out: "They are happy"
                },
                {
                    descr: "Be question",
                    in: "Is she happy?",
                    out: "Are they happy?"
                },
                {
                    descr: "Be question, negated",
                    in: "Isn't he happy?",
                    out: "Are they not happy?"
                },
                {
                    descr: "Have statement",
                    in: "She has a book",
                    out: "They have a book"
                },
                {
                    descr: "Have question",
                    in: "Has he a book?",
                    out: "Have they a book?"
                },
                {
                    descr: "Have question, negated",
                    in: "Hasn't she a book?",
                    out: "Have they not a book?"
                },
                {
                    descr: "Modal verb, statement",
                    in: "She should go",
                    out: "They should go"
                },
                {
                    descr: "Modal verb, question",
                    in: "Should he go?",
                    out: "Should they go?"
                },
                {
                    descr: "Modal verb, question, negated",
                    in: "Won't she go?",
                    out: "Will they not go?"
                }
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
                    in: "He will travel to Japan",
                    out: "They will travel to Japan"
                },
                {
                    descr: "Be going to",
                    in: "He is going to travel to Japan",
                    out: "They are going to travel to Japan"
                    //pending: 8
                }
            ]
        },
        Continuous: [
            {
                descr: "Present",
                in: "She is reading a book",
                out: "They are reading a book"
                //pending: 8
            },
            {
                descr: "Past",
                in: "She was reading a book",
                out: "They were reading a book"
                //pending: 8
            },
            {
                descr: "Future",
                in: "He will be waiting",
                out: "They will be waiting"
            }
        ],
        Perfect: [
            {
                descr: "Present",
                in: "She has been reading a book",
                out: "They have been reading a book"
                //pending: 8
            },
            {
                descr: "Past",
                in: "She had been reading a book",
                out: "They had been reading a book"
            },
            {
                descr: "Future",
                in: "He will have left",
                out: "They will have left"
            }
        ]
    }
};
