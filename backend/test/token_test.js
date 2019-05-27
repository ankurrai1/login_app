const { tokenHelper } = require("../src/helpers/index");

const mockData = {
    _id: "1",
    type: "customer",
};

describe(" Token Helper ", () => {
    it("should create a jwt token", () => {
        const token = tokenHelper.create(mockData);
        expect(token).toBeDefined();
    });

    it("should decode a jwt token", () => {
        const token = tokenHelper.create(mockData);
        const decoded = tokenHelper.decode(token);
        expect(decoded).toBeDefined();
        expect(decoded._id).toBeDefined();
        expect(decoded._id).toBe(mockData._id);
        expect(decoded.type).toBeDefined();
        expect(decoded.type).toBe(mockData.type);
    });
});
