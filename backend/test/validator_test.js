const { ObjectId }=  require("mongodb");
let app =  require("../app")
const { validator } = require("../src/helpers/index")
const fakeID = new ObjectId();

describe(" ObjectId Validator ", () => {
    it("should return true", () => {
        expect(validator.objectId(fakeID)).toBeTruthy();
    });
    it("should throw error", () => {
        expect(() => {
            validator.objectId("1232");
        }).toThrowError("Not a valid ID");
    });
});

describe(" Field Validator ", () => {
    it("should return true", () => {
        expect(validator.fields("email", "User")).toBeTruthy();
        expect(validator.fields({ email: "test@test.com" }, "User", true));
    });
    it("should throw error", () => {
        expect(() => {
            validator.fields("age", "User");
        }).toThrowError("Not a valid field");
        expect(() => {
            validator.fields("email", "Cool");
        }).toThrowError("Not a valid model");
        expect(() => {
            validator.fields(undefined, "User");
        }).toThrowError("Field is empty");
        expect(() => {
            validator.fields({ error: "cool" }, "User", true);
        }).toThrowError("Not a valid field");
        expect(() => {
            validator.fields({}, "User", true);
        }).toThrowError("Field is empty");
    });
});