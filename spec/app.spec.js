var Request = require('request');
// var ApiController = require('../controller/ApiController');
// var ApiModel = require('../model/ApiModel');
// describe("Server", function() {
//     var Request = require("request");
//     var server;
//     beforeAll(function() {
//         server = require("../app");
//     });
//     afterAll(function() {
//         server.close();
//     });
//     describe("GET /", function() {
//         var data = {};
//         beforeAll((done) => {
//             Request.get("http://localhost:8080/", (error, response, body) => {
//                 data.status = response.statusCode;
//                 data.body = body;
//                 done();
//             });
//         });
//         // it("Status 200", function() {
//         //     expect(data.status).toBe(200);
//         // });
//         // it("Body", function() {
//         //     expect(data.body).toBe("The Polyglot Developer");
//         // });
//     });
// });

// describe("Server - Jasmine", function() {
    
//     var server;
    
//     beforeEach(function() {
//         server = require('../app');
//     });
//     afterAll(function() {
//         server.close();
//     });
//     describe("Server status", function() {
//         var data = {};
//         beforeAll(function(done) {
//             Request.get("http://localhost:8080", function(error, response, body) {
//                 data.status = response.statusCode;
//                 data.body =  body;
//                 done();
//             })
//         });
//         it("status 200", function() {
//             expect(data.status).toBe(200);
//         });
//     });

// });

describe("ApiController", function() {
    // 
    var api;
    // var ApiController;
    var ApiController = require('../controller/ApiController');
    beforeEach(function() {
        api = new ApiController();
    });
    // it("test", function() {
    //     spyOn(ApiController(), 'corsOptions');
    //     ApiController().generateToken;
    //     expect(ApiController().generateToken.toHaveBeenCalled);
    // });

    it('should exist', function() {
        // api = new ApiController();
        spyOn(api, 'generateToken');
        api.generateToken;
        expect(api.generateToken).toHaveBeenCalled;
    });

});
