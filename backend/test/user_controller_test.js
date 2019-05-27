const request = require("supertest");
const { ObjectId } =  require("mongodb");

let  app = require("../app");


let userId;
let userEmail;
let userToken;
const fakeId = new ObjectId();

jest.setTimeout(10000);

describe(" #POST /user", () => {
    it("should create user", async () => {
        const res = await request(app).post("/user")
        .send({
            data: {
                email: "foo@foo.com",
                password: "123456",
                role: "CUSTOMER"
            }
        });
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.save).toBeDefined();
        expect(res.body.save._id).toBeDefined();
        expect(res.body.save.email).toBeDefined();
        expect(res.body.save.password).toBeDefined();
        expect(res.body.message).toBeDefined();
        expect(res.body.message).toBe("User has been created");
        expect(res.status).toBeDefined();
        expect(res.status).toEqual(200);
        userId = await res.body.save._id;
        userEmail = await res.body.save.email;
        userToken = await res.body.token;
    });
    it("should return 422 #POST /user", async () => {
        const res = await request(app).post("/user")
        .send({
            data: {
                email: "foo.com",
                password: "123",
            }
        });
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.errors).toBeDefined();
        expect(res.body.errors).toMatchSnapshot();
        expect(res.status).toBeDefined();
        expect(res.status).toEqual(422);
    });
    it("should return 500 #POST /user", async () => {
        const res = await request(app).post("/user")
        .send({
            data: {
                email: "foo@foo.com",
                password: "123456",
                role: "CUSTOMER"
            }
        });
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.errors).toBeDefined();
        expect(res.status).toBeDefined();
        expect(res.status).toEqual(500);
    });
});

describe(" #GET /user ", () => {
    it("should get all user", async () => {
        const res = await request(app).get("/user")
        .set("user-access-token", userToken);
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.users).toBeDefined();
        expect(res.body.users[0]).toBeDefined();
        expect(res.body.users[0]._id).toBeDefined();
        expect(res.body.users[0].email).toBeDefined();
        expect(res.body.users[0].password).toBeDefined();
        expect(res.status).toBeDefined();
        expect(res.status).toEqual(200);
    });
    it("should get a user by ID", async () => {
        const res = await request(app).get(`/user/${userId}`)
        .set("user-access-token", userToken);
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.user).toBeDefined();
        expect(res.body.user._id).toBeDefined();
        expect(res.body.user._id).toBe(userId);
        expect(res.body.user.email).toBeDefined();
        expect(res.body.user.password).toBeDefined();
        expect(res.status).toBeDefined();
        expect(res.status).toEqual(200);
    });
    it("should get a user by email", async () => {
        const res = await request(app).get(`/user/email/${userEmail}`)
        .set("user-access-token", userToken);
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.user).toBeDefined();
        expect(res.body.user._id).toBeDefined();
        expect(res.body.user.email).toBeDefined();
        expect(res.body.user.email).toBe(userEmail);
        expect(res.body.user.password).toBeDefined();
        expect(res.status).toBeDefined();
        expect(res.status).toEqual(200);
    });
    it("should return 401 for #GET /user", async () => {
        const res = await request(app).get(`/user`);
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.errors).toBeDefined();
        expect(res.body.errors).toMatchSnapshot();
        expect(res.status).toBeDefined();
        expect(res.status).toEqual(401);
    });
    it("should return 401 for #GET /user/:id", async () => {
        const res = await request(app).get(`/user/${userId}`);
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.errors).toBeDefined();
        expect(res.body.errors).toMatchSnapshot();
        expect(res.status).toBeDefined();
        expect(res.status).toEqual(401);
    });
    it("should return 422 for #GET /user/:id", async () => {
        const res = await request(app).get(`/user/error`)
        .set("user-access-token", userToken);
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.errors).toBeDefined();
        expect(res.body.errors).toMatchSnapshot();
        expect(res.status).toBeDefined();
        expect(res.status).toEqual(422);
    });
    it("should return 404 for #GET /user/:id", async () => {
        const res = await request(app).get(`/user/${fakeId}`)
        .set("user-access-token", userToken);
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.errors).toBeDefined();
        expect(res.body.errors).toMatchSnapshot();
        expect(res.status).toBeDefined();
        expect(res.status).toEqual(404);
    });
    it("should return 401 for #GET /user/:field/:data", async () => {
        const res = await request(app).get(`/user/email/${userEmail}`);
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.errors).toBeDefined();
        expect(res.body.errors).toMatchSnapshot();
        expect(res.status).toBeDefined();
        expect(res.status).toEqual(401);
    });
    it("should return 422 for #GET /user/:field/:data", async () => {
        const res = await request(app).get(`/user/error/${userEmail}`)
        .set("user-access-token", userToken);
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.errors).toBeDefined();
        expect(res.body.errors).toMatchSnapshot();
        expect(res.status).toBeDefined();
        expect(res.status).toEqual(422);
    });
    it("should return 404 for #GET /user/:field/:data", async () => {
        const res = await request(app).get(`/user/email/error`)
        .set("user-access-token", userToken);
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.errors).toBeDefined();
        expect(res.body.error).toMatchSnapshot();
        expect(res.status).toBeDefined();
        expect(res.status).toEqual(404);
    });
});

describe(" #PUT /user ", () => {
    it("should update a user", async () => {
        const res = await request(app).put(`/user/${userId}`)
        .set("user-access-token", userToken)
        .send({
            data: {
                email: "bar@bar.com"
            }
        });
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.user).toBeDefined();
        expect(res.body.user._id).toBeDefined();
        expect(res.body.user.email).toBeDefined();
        expect(res.body.user.email).toBe("bar@bar.com");
        expect(res.body.user.password).toBeDefined();
        expect(res.body.message).toBeDefined();
        expect(res.body.message).toBe("User has been updated");
        expect(res.status).toBeDefined();
        expect(res.status).toEqual(200);
    });
    it("should return 401 for #PUT /user", async () => {
        const res = await request(app).put(`/user/${userId}`)
        .send({
            data: {
                email: "bar@bar.com"
            }
        });
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.errors).toBeDefined();
        expect(res.body.error).toMatchSnapshot();
        expect(res.status).toBeDefined();
        expect(res.status).toEqual(401);
    });
    it("should return 422 for #PUT /user", async () => {
        const res = await request(app).put(`/user/error`)
        .set("user-access-token", userToken)
        .send({
            data: {
                email: "bar@bar.com"
            }
        });
        const secondRes = await request(app).put(`/user/${userId}`)
        .set("user-access-token", userToken)
        .send({
            data: {}
        });
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.errors).toBeDefined();
        expect(res.body.error).toMatchSnapshot();
        expect(res.status).toBeDefined();
        expect(res.status).toEqual(422);
        expect(secondRes).toBeDefined();
        expect(secondRes.body).toBeDefined();
        expect(secondRes.body.errors).toBeDefined();
        expect(secondRes.body.error).toMatchSnapshot();
        expect(secondRes.status).toBeDefined();
        expect(secondRes.status).toEqual(422);
    });
});


describe(" #DELETE /user ", () => {
    it("should delete a user", async () => {
        const res = await request(app).delete(`/user/${userId}`)
        .set("user-access-token", userToken);
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.user).toBeDefined();
        expect(res.body.user._id).toBeDefined();
        expect(res.body.user.email).toBeDefined();
        expect(res.body.user.password).toBeDefined();
        expect(res.body.message).toBeDefined();
        expect(res.body.message).toBe("User has been removed");
        expect(res.status).toBeDefined();
        expect(res.status).toEqual(200);
    });
    it("should 401 #DELETE for /user/:id", async () => {
        const res = await request(app).delete(`/user/${userId}`);
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.errors).toBeDefined();
        expect(res.body.error).toMatchSnapshot();
        expect(res.status).toBeDefined();
        expect(res.status).toEqual(401);
    });
    it("should 422 #DELETE for /user/:id", async () => {
        const res = await request(app).delete(`/user/error`)
        .set("user-access-token", userToken);
        expect(res).toBeDefined();
        expect(res.body).toBeDefined();
        expect(res.body.errors).toBeDefined();
        expect(res.body.error).toMatchSnapshot();
        expect(res.status).toBeDefined();
        expect(res.status).toEqual(422);
    });
});
