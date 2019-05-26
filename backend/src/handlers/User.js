const User = require("../models/User");
const { check, validationResult } = require('express-validator/check');
const { matchedData } = require("express-validator/filter");
const {tokenHelper} = require("../helper");

exports.create = async (req, res) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }
    const validData = await matchedData(req).data;
    const user = new User(validData);
    try {
        const save= await user.save();
        const token = tokenHelper.create({
            id: save._id,
            email: save.email,
        });
        return res.status(200).json({ token, save, message: "User has been created" });
    } catch (errors) {
        console.log("i am sending error", errors);
        return res.status(500).json({ errors: errors.mapped() });
    }
};

exports.all = async (req, res)=> {
    try {
        const users = await User.find({});
        return res.status(200).json({ users });
    } catch (errors) {
        return res.status(500).json({ errors });
    }
};


exports.byId = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }
    const validData = matchedData(req);
    try {
        const user = await User.findById(validData.id);
        if (!user) return res.status(404).json({ errors: "User not found" });
        return res.status(200).json({ user });
    } catch (errors) {
        return res.status(500).json({ errors });
    }
};

exports.byField = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }
    const validData = matchedData(req);
    const formatData = {};
    formatData[validData.field] = validData.data;
    try {
        let user = await User.find(formatData);
        if (user.length === 1) user = user[0];
        if (user.length === 0) return res.status(404).json({ errors: "User not found" });
        return res.status(200).json({ user });
    } catch (errors) {
        return res.status(500).json({ errors });
    }
};

exports.update = async (req, res)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }
    const validData = matchedData(req);
    try {
        await User.findByIdAndUpdate(validData.id, validData.data);
        const user = await User.findById(validData.id);
        return res.status(200).json({ user, message: "User has been updated" });
    } catch (errors) {
        return res.status(500).json({ errors });
    }
};

exports.remove = async (req, res)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }
    const validData = matchedData(req);
    try {
        const user = await User.findByIdAndRemove(validData.id);
        return res.status(200).json({ user, message: "User has been removed" });
    } catch (errors) {
        return res.status(500).json({ errors });
    }
};