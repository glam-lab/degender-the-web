let excludedDomains = 
#import "../excluded-domains.json"
;

// Checks if this domain is an an excluded list.
// Returns the domain as a string, or null. 
let domainRegExp = new RegExp('(' + excludedDomains.join('|') + ')', 'i');
function inExcludedDomain(url) {
    let result = domainRegExp.exec(url);
    if (result != null) {
        result = result[0];
    } 
    return result;
}

export { inExcludedDomain };
