const {validationResult} = require("express-validator");
const User = require("../model/db");
function userRegister(req, res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const err = new Error("Input tidak valid");
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    const result = {
        message: "Register success!!",
        data: {
            username,
            email,
            password
        }
    }
    
    res.status(201).json(result);

    const user = new User(result.data);
    user.save().then(() => console.log("register success!!"));
    
}

module.exports = {userRegister}