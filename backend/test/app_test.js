const request = require("supertest");
let app = require("../app.js");
const bluebird = require("bluebird");
const mongoose = require('mongoose');

describe("APP", () => {

    before(() => {
        (mongoose).Promise = bluebird;
        mongoose.connect(process.env.MONGO_TEST).then(
            () => { console.log("Connected to Test DB"); }
        ).catch(err => {
            console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
        });
    });
    

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