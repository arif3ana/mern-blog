const express = require("express");
const {body} = require("express-validator");
const authController = require("../controllers/authController");
const AuthenticateToken = require("../middleware/authenticateToken")
const app = express()

app.post("/register", 
[
    body("username").escape().isLength({min: 3}).withMessage("username anda tidak valid!!"),
    body("email").notEmpty().escape().isEmail().withMessage("Email anda tidak valid!!"),
    body("password").escape().isLength({min: 7}).withMessage("password anda terlalu lemah")
], authController.userRegister);
app.post("/refresh", authController.refreshToken);
app.post("/login", authController.userLogin);
app.delete("/logout", AuthenticateToken, authController.userLogout);

module.exports = app;
