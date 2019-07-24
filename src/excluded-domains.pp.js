let excludedDomains = 
#import "../excluded-domains.json"
;

const list = Object.keys(excludedDomains);
const regexp = new RegExp('(' + list.join('|') + ')', 'i');

// Checks if this domain is an an excluded list.
// Returns the domain as a string, or null. 
function inExcludedDomain(url) {
    let result = regexp.exec(url);
    if (result != null) {
        result = result[0];
    } 
    return result;
}

// Finds the reason why a domain is excluded.
function whyExcluded(domain) {
    return excludedDomains[domain];
}

export { inExcludedDomain, whyExcluded };
