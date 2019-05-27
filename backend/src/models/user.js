const mongoose =require("mongoose");
const bcrypt =require("bcryptjs");

const Isemail = require("isemail");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        validate: {
            validator: function (email) {
                return Isemail.validate(email);
            },
            message: "Not a valid email address"
        }
    },
    fullName:{
        type:String,
        required: [true, "Name is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
    }
}, { timestamps: true });

UserSchema.pre("save", function(next) {
    if (!this.isModified("password")) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return next(err);
            this.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = async function (userPassword) {
    return bcrypt.compare(userPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;