const express = require("express");
const asyncHandler = require("express-async-handler");
const { check }= require("express-validator/check");
const User  = require("../handlers/User")
const Auth = require("../handlers/Auth");
const validator = require("../helper/validator");

var router = express.Router();

router.use(Auth.authJwt);

router.post("/", [
    check("data")
    .custom(value => validator.fields(value, "User", true))
    .custom(value => validator.checkData(value, "User")),
    check("data.email")
        .isEmail().withMessage("Must be a valid email")
        .trim()
        .normalizeEmail()
], asyncHandler(User.create));

router.get("/", asyncHandler(User.all));

router.get("/:id", [
    check("id")
    .trim()
    .custom(value => validator.objectId(value))
], asyncHandler(User.byId));

router.get("/:field/:data", [
    check("field")
    .trim()
    .custom(value => validator.fields(value, "User")),
    check("data")
    .trim()
], asyncHandler(User.byField));

router.put("/:id", [
    check("id")
    .trim()
    .custom(value => validator.objectId(value)),
    check("data")
    .custom(value => validator.fields(value, "User", true))
    .custom(value => validator.checkData(value, "User", false))
], asyncHandler(User.update));

router.delete("/:id", [
    check("id")
    .trim()
    .custom(value => validator.objectId(value))
], asyncHandler(User.remove));

module.exports = router;