const jwt = require("jsonwebtoken");

// jadikan fungsi handleError menjadi middleware untuk menghandle error message
function handleError(msg, status, next) {
    const err = new Error(msg);
    err.status = status;
    return next(err);
}

function AuthenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        handleError("Maaf anda belum login", 401, next);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (er, user) => {
        if (er) {
            handleError("Token tidak valid", 403, next);
        }
        req.user = user;
        next()
    })   
}

module.exports = AuthenticateToken;