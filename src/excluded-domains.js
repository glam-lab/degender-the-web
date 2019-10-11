import { excludedDomains } from "../data/excluded-domains.js";

const list = Object.keys(excludedDomains);
const regexp = new RegExp("\\b(" + list.join("|") + ")\\b", "i");

// Test if this domain is an an excluded list. Returns true or false.
export function inExcludedDomain(host) {
    return regexp.test(host);
}
