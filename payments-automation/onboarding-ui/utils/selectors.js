module.exports = {
    baseURL: 'https://hw-merch-console.server4.ih.testenv.io/onboarding',

    //  ="user-profile-button"
    // userProfileButton: 'button[data-testid="user-profile-button"]',
    userProfileButton: '//html/body/div/div/div/div/div[2]/div[1]/div[2]/div[2]/div/button/div',

    // data-testid="logout-button"
    // logoutButton: 'button[data-testid="logout-button"]',
    logoutButton: '//html/body/div/div/div/div/div[2]/div[1]/div[2]/div[2]/div/ul/span/button',

    // data-testid not needed
    nameInput: 'input[placeholder="Organization Name"]',
    phoneInput: 'input[placeholder="Phone Number"]',
    brazilCountry: '//li[normalize-space()="🇧🇷Brazil (+55)"]',
    countryButton: '//button[.//p[normalize-space()="Country code"]]',
    
};