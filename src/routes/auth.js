const express = require("express");
const {body} = require("express-validator");
const userController = require("../controllers/user");
const app = express()

app.post("/register", [
    body("username").escape().isLength({min: 3}).withMessage("username anda tidak valid!!"),
    body("email").notEmpty().escape().isEmail().withMessage("Email anda tidak valid!!"),
    body("password").escape().isLength({min: 7}).withMessage("password anda terlalu lemah")
], userController.userRegister);

module.exports = app;
