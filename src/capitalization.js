// Capitalize the first letter of the given string.
export function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1);
}

// Return true if the given string begins with a capital letter.
export function isCapitalized(word) {
    return /^[A-Z]/.test(word);
}
