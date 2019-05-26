const Router= require("express");
const check = require("express-validator/check").check;
const asyncHandler= require("express-async-handler");

const Auth = require("../handlers/Auth");

const router = Router();

router.post("/", [
    check("email")
    .isEmail().withMessage("Must be a valid email")
    .trim()
    .normalizeEmail(),
    check("password")
    .trim()
    .isLength({ min: 6 }).withMessage("Password should be at least 6 chars long")
], asyncHandler(Auth.login));

module.exports = router;