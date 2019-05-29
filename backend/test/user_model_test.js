const { User, UserSchema } = require("../src/models/user");

const mockUser = {
    email: "foo@foo.com",
    fullName:"",
    password: "123456"
};

let user;

describe("User model", () => {

    beforeEach(async () => {
        user = new User(mockUser);
        return user.save();
    });
    
    afterEach(async () => {
        await User.remove({ email: "bar@bar.com" }).exec();
        await User.remove({ _id: user._id }).exec();
    });

    it("should bcrypt the password", async () => {
        const user = await User.findOne({ email: "foo@foo.com" });
        expect(user.password).not.toBe("123456");
        expect(user.password.length).toEqual(60);
    });
    it("should compare password", async () => {
        const user = await User.findOne({ email: "foo@foo.com" });
        const match = await user.comparePassword("123456");
        expect(match).toBeTruthy();
        const wrong = await user.comparePassword("123");
        expect(wrong).toBeFalsy();
    });
    it("should require password", async () => {
        const wrongUser = {
            email: "bar@bar.com",
            
        };
        const user = new User(wrongUser);
        let shouldThrow;
        try {
            await user.save();
        } catch (err) {
            shouldThrow = err;
        }
        expect(shouldThrow).toBeDefined();
        expect(shouldThrow.message).toBeDefined();
        expect(shouldThrow.message).toBe("User validation failed: password: Password is required");
    });
    it("should require password 6 min length", async () => {
        const wrongUser = {
            email: "bar@bar.com",
            password: "123",
        };
        const user = new User(wrongUser);
        let shouldThrow;
        try {
            await user.save();
        } catch (err) {
            shouldThrow = err;
        }
        expect(shouldThrow).toBeDefined();
        expect(shouldThrow.message).toBeDefined();
        expect(shouldThrow.message).toBe("User validation failed: password: Password must be at least 6 characters long");
    });
    it("should require email", async () => {
        const wrongUser = {
            password: "123456",
            
        };
        const user = new User(wrongUser);
        let shouldThrow;
        try {
            await user.save();
        } catch (err) {
            shouldThrow = err;
        }
        expect(shouldThrow).toBeDefined();
        expect(shouldThrow.message).toBeDefined();
        expect(shouldThrow.message).toBe("User validation failed: email: Email is required"); 
    });
    it("should validate email format", async () => {
        const wrongUser = {
            email: "bar",
            password: "123456"
        };
        const user = new User(wrongUser);
        let shouldThrow;
        try {
            await user.save();
        } catch (err) {
            shouldThrow = err;
        }
        expect(shouldThrow).toBeDefined();
        expect(shouldThrow.message).toBeDefined();
        expect(shouldThrow.message).toBe("User validation failed: email: Not a valid email address");
    });
});
