module.exports = {
    rangeSelector: 'svg[class*="IconChevronDownRounded"]',
    rangeOption: 'li:has-text("Last Week")',
    applyRangeButton: 'button:has-text("Apply")',
    addFilterTab: 'button:has-text("Add Filter")',
    supplierSearchInput: '//*[@id="root"]/div/div/main/div/div[1]/div[2]/div[1]/div/div/div[1]/div/input',
    firstSupplierButton: 'xpath=/html/body/div/div/div/main/div/div[1]/div[2]/div/div/div/div[3]/div[1]',
    firstTableRoundDetailsButton: 'button[aria-label*="Round details"]',
    statusSearchInput: 'button:has-text("Statuses: All") >> xpath=..//div[div/p[normalize-space(.)="Success"]]',
};
