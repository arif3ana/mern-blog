const jwt = require("jsonwebtoken");

function handleError(msg, status, next) {
    const err = new Error(msg);
    err.status = status;
    return next(err);
}

function AuthenticateToken(req, res, next) {
    const token = req.header("Authorization");
    if (!token) {
        handleError("Maaf anda belum login", 401, next);
    }
    jwt.verify(token, "user-secret-key", (e, user, next) => {
        if (e) {
            handleError("Invalid token", 403, next);
        }
        req.user = user;
        next();
    })   
}

module.exports = AuthenticateToken;