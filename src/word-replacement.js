var dictionary = { "she": "they",
                   "her": "them",           
                   // But: 'her book' -> 'their book'
                   "hers": "theirs",
                   "herself": "themself",
                   "he": "they",
                   "him": "them",
                   "his": "their", 
                   // But: 'the book is his' -> 'the book is theirs'
                   "himself": "themself" };

// Capitalize the first letter of the given string
function titleCase(word) {
    return word[0].toUpperCase() + word.slice(1);
}

export { dictionary, titleCase };
