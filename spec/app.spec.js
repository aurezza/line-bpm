var Request = require("request");
var App = require('../app');

describe("Server", () => {
    var server;
    beforeAll(() => {
        server = require("../app");
    });
    afterAll(() => {
        server.close();
    });
    describe("GET /", () => {
        var data = {};
        beforeAll((done) => {
            Request.get("http://localhost:8080/", (error, response, body) => {
                data.status = response.statusCode;
                data.body = body;
                done();
            });
        });
        // it("Status 200", () => {
        //     expect(data.status).toBe(200);
        // });
        // it("Body", () => {
        //     expect(data.body).toBe("The Polyglot Developer");
        // });
    });
});