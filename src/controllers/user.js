const {validationResult} = require("express-validator");
const {User} = require("../model/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRound = 10;

const userRegister = async (req, res, next) => {

    const salt = await bcrypt.genSalt(saltRound);
    
    const username = req.body.username;
    const email = req.body.email;
    const password = await bcrypt.hash(req.body.password, salt);

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const err = new Error("Input tidak valid");
        err.status = 400;
        err.data = errors.array();
        return next(err)
    }

    const result = {
        message: "Register success!!",
        data: {
            username,
            email,
            password
        }
    }

    await res.status(201).json(result);

    const user = new User(result.data);
    user.save().then(() => console.log("register success!!"));
    
}

const userLogin = async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        const err = new Error("Email atau Password salah!!");
        err.status = 401;
        return next(err);
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    
    if (!validPassword) {
        const err = new Error("Password anda tidak valid");
        err.status = 401;
        return next(err);
    }

    const token = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: 86400 //24 jam
    });
    
    res.status(200).json({
        message: "login Success!!",
        token,
        data: {
            userId: user._id,
            email: user.email,
        }
    })
}

module.exports = {userRegister, userLogin}