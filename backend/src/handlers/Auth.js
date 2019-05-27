const { check, validationResult } = require('express-validator/check');
const { matchedData } = require("express-validator/filter");

const User = require("../models/User");
const {tokenHelper} = require("../helpers");

exports.login = async (req, res, next) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }
    const validData = matchedData(req);
    const user = await User.findOne({ email: validData.email });
    if (!user) return res.status(404).json({ errors: "User not found"});
    const match = await user.comparePassword(validData.password);
    if (!match) return res.status(401).json({ errors: "Wrong password, please try again" });
    const token = tokenHelper.create({
        id: user._id,
        email: user.email,
        role: user.role
    });
    return res.status(200).json({ token });
};

exports.authJwt = (req, res, next) => {
    if (req.originalUrl === "/user" && req.method === "POST") {
        return next();
    }
    const token = req.headers["user-access-token"];
    if (!token) {
        return res.status(401).json({ errors: "Not a valid token" });
    }

    try {
        req.user = tokenHelper.decode(token);
        return next();
    } catch (errors) {
        return res.status(500).json({ errors });
    }
};