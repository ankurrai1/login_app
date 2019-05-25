const request = require("supertest");
let assert = require("chai").assert;
let app = require("../app.js");

describe("APP", () => {
    beforeEach(function () {
        handleError = function (done) {
            return function (err, res) {
                if (err) {
                    return done(err);
                }
                done();
            };
        };
    });
    describe("GET /bad", () => {
        it("it should resonds with 404", done => {
            request(app)
                .get("/bad")
                .expect(404)
                .end(handleError(done));
        });
        it("should resonds with 200", done => {
            request(app)
                .get("/")
                .expect(200)
                .expect("Content-Type", "text/html; charset=utf-8")
                .expect(/all is well/)
                .end(handleError(done));
        });
    });
    // describe("GET /", () => {
    // });
});