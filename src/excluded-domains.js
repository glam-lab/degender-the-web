import { excludedDomains } from "../data/excluded-domains.js";

const list = Object.keys(excludedDomains);
const regexp = new RegExp("(" + list.join("|") + ")", "i");

// Test if this domain is an an excluded list. Returns true or false.
export function inExcludedDomain(url) {
    return regexp.test(url);
}

// Get the domain, if on an excluded list.
export function getExcludedDomain(url) {
    let result = regexp.exec(url);
    if (result != null) {
        result = result[0];
    }
    return result;
}

// Finds the reason why a domain is excluded.
export function whyExcluded(domain) {
    return excludedDomains[domain];
}
