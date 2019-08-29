import { excludedDomains } from "../data/excluded-domains.js";

const list = Object.keys(excludedDomains);
const regexp = new RegExp("\\b(" + list.join("|") + ")\\b", "i");

// Test if this domain is an an excluded list. Returns true or false.
export function inExcludedDomain(host) {
    return regexp.test(host);
}

// Get the domain, if on an excluded list.
export function getExcludedDomain(host) {
    let result = regexp.exec(host);
    if (result != null) {
        result = result[0];
    }
    return result;
}

// Finds the reason why a domain is excluded.
export function getWhyExcluded(host) {
    return excludedDomains[getExcludedDomain(host)];
}
