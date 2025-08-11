module.exports = {
    rangeSelector: 'svg[class*="IconChevronDownRounded"]',
    rangeOption: 'li:has-text("Last Week")',
    applyRangeButton: 'button:has-text("Apply")',
    addFilterTab: 'button:has-text("Add Filter")',
    supplierSearchInput: 'input[placeholder="Search for a name..."]',
    firstTableRoundDetailsButton: 'button[aria-label*="Round details"]',
    statusSearchInput: 'button:has-text("Statuses: All") >> xpath=..//div[div/p[normalize-space(.)="Success"]]',
};