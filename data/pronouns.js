export const compoundPronouns = {
    "he or she": "they",
    "him or her": "them",
    "his or her": "their",
    "his or hers": "theirs",
    "himself or herself": "themself",
    "him or herself": "themself",
    he: "they",
    she: "they"
};

export const genderPronouns = {
    // She/her/her/hers/herself
    she: "they",
    her: "them",
    her_poss_adj: "their",
    hers: "theirs",
    herself: "themself",
    // He/him/his/his/himself
    he: "they",
    him: "them",
    his_poss_adj: "their",
    his: "theirs",
    himself: "themself"
};

// Make a combined dictionary using object spread.
export const allPronouns = { ...compoundPronouns, ...genderPronouns };
