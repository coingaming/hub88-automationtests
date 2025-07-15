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


