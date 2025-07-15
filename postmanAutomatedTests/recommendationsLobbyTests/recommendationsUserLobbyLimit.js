pm.test("Response status code is 200", function () {
  pm.response.to.have.status(200);
});

// Updated test to check if the response is a JSON
pm.test("Response is a JSON", function () {
  pm.response.to.be.json;
});

// Every object must have game_code as a string
// Parse the response JSON directly
const response = pm.response.json();

// Check if 'games' array exists in the response
pm.test('Games array exists in the response', () => {
    pm.expect(response.games).to.exist;
    pm.expect(response.games).to.be.an('array');
});

// Assert that at least one game has the 'game_code' field
pm.test('At least one game has the game_code field', () => {
    pm.expect(response.games.some(game => game.game_code)).to.be.true;
});



// Verify if the quantity of game_code in the response corresponds to the limit integer value in the request
pm.test("Verify the quantity of game_code in the response matches the limit from the request", function () {
    const responseBody = pm.response.json();
    // Parse the raw request body to extract the limit
    const requestBody = JSON.parse(pm.request.body.raw);
    const limit = parseInt(requestBody.limit); // Convert limit to integer
    const gameCodesCount = responseBody.games.length; // Get the count of game codes
    pm.expect(gameCodesCount).to.equal(limit);
});
