const {validationResult} = require("express-validator");
const {User} = require("../model/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRound = 10; // digunakan untuk enkripsi password

// POST - Register
const userRegister = async (req, res, next) => {

    const salt = await bcrypt.genSalt(saltRound);
    
    const username = req.body.username;
    const email = req.body.email;
    const password = await bcrypt.hash(req.body.password, salt);

    const errors = validationResult(req); // hasil dari validasi jika ada error
    if(!errors.isEmpty()) {
        const err = new Error("Input tidak valid");
        err.status = 400;
        err.data = errors.array();
        return next(err)
    }

    const dataResult = {
            username,
            email,
            password
        }

    const user = new User(dataResult);
    user.save()
    .then((result) => res.status(201).json({
        message: "Register Success!!",
        data: result
    }))
    .catch((error) => res.status(400).json({
        message: "Input tidak valid",
        error: error.keyPattern
    }));  
}

// POST - Login authentication
const userLogin = async (req, res, next) => {
    // Validasi credential {email dan password}
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        const err = new Error("Email atau Password salah!!");
        err.status = 401;
        return next(err);
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    
    if (!validPassword) {
        const err = new Error("Password anda salah!");
        err.status = 401;
        return next(err);
    }

    // Generate accessToken dan refreshToken jwt
    const accessToken = jwt.sign({user: user._id}, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: 300 });
    const refreshToken = jwt.sign({user: user._id}, process.env.REFRESH_TOKEN_SECRET_KEY, {expiresIn: 24 * 60 * 60 * 1000})
    
    // kirim respons sebagai header Authorization Bearer <token> dan simpan refreshToken di cookie untuk kebutuhan logout dan refresh accessToken
    res.status(200)
    .cookie("id_refresh", refreshToken, { path: '/', maxAge: 24 * 60 * 60 * 1000, sameSite: 'none', secure: true})
    .header("Authorization", "Bearer " + accessToken)
    .json({
    accessToken: "Bearer " + accessToken,
    refreshToken: refreshToken,
    message: "login Success!!",
    data: {
        userId: user.username,
        email: user.email,
    }})
}

// POST - refresh token jwt
const refreshToken = (req, res, next) => {
    const tokenRefresh = req.cookies.id_refresh;
    if (!tokenRefresh) {
        const err = new Error("Silahkan Login kembali");
        err.status = 401;
        return next(err)
    }
    
    try {
        const decoded = jwt.verify(tokenRefresh, process.env.REFRESH_TOKEN_SECRET_KEY);
        const accessToken = jwt.sign({user: decoded.user}, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: 300 });
        res.status(200).header("Authorization", "Bearer " + accessToken)
        .json({
            user: decoded.user
        });
    } catch (error) {
        const err = new Error("Unauthorized");
        err.status = 401;
        err.data = error;
        return next(err)
    }

}

// DELETE - Logout
const userLogout = (req, res) => {
    // Menghapus cookie refreshToken
    res.clearCookie('id_refresh').status(200)
    .json({
        message: "Logout success!!"
    })
}

module.exports = {userRegister, refreshToken, userLogin, userLogout}