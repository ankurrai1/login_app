const request = require("supertest");
let app = require("../app.js");
const bluebird = require("bluebird");
const mongoose = require('mongoose');

const { User, UserSchema } =  require("../src/models/user");

const mockUser = {
    email: "login@login.com",
    password: "123456"
};


describe(" #POST /login ", () => {

    beforeEach(async () => {
        const user = new User(mockUser);
        return user.save();
    });
    
    afterEach(async () => {
        await User.remove({ email: "login@login.com" }).exec();
    });

    it("should login a user and create a token", async () => {
        const res = await request(app).post("/login")
        .send({
            email: "login@login.com",
            password: "123456"
        });
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.token).toBeDefined();
        expect(res.status).toBeDefined();
        expect(res.status).toEqual(200);
    });
    it("should return 401 for #POST /login", async () => {
        const res = await request(app).post("/login")
        .send({
            email: "login@login.com",
            password: "errors"
        });
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.errors).toBeDefined();
        expect(res.body.errors).toBe("Wrong password, please try again.");
        expect(res.status).toBeDefined();
        expect(res.status).toEqual(401);
    });
    it("should return 404 for #POST /login", async () => {
        const res = await request(app).post("/login")
        .send({
            email: "lol@lol.com",
            password: "errors"
        });
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.errors).toBeDefined();
        expect(res.body.errors).toBe("User not found");
        expect(res.status).toBeDefined();
        expect(res.status).toEqual(404);
    });
    it("should return 422 for #POST /login", async () => {
        const res = await request(app).post("/login")
        .send({
            email: "lol@lol.com",
        });
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.errors).toBeDefined();
        expect(res.body.errors).toMatchSnapshot();
        expect(res.status).toBeDefined();
        expect(res.status).toEqual(422);
    });
});
