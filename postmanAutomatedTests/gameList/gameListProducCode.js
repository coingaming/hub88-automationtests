pm.test("Check response status is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Check response is JSON", function () {
    pm.response.to.be.json;
});

pm.test("Check game_code is a string in first game object", function () {
    const response = pm.response.json();
    pm.expect(response[0].game_code).to.be.a('string', 'game_code should be a string');
});

var responseJSON = pm.response.json();
var requestBody = pm.request.body.raw; // Assuming the request body is in raw format
var requestBodyJSON = JSON.parse(requestBody);
var productCode = requestBodyJSON.product_code; // Extracting product_code from the request body

pm.test("Each game_code contains the product_code value", function () {
    responseJSON.forEach(function(game) {
        pm.expect(game.game_code).to.include(productCode, 'product_code should be a substring of game_code');
    });
});

