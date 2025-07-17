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