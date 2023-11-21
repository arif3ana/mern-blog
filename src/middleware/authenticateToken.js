const jwt = require("jsonwebtoken");

// jadikan fungsi handleError menjadi middleware untuk menghandle error message
function handleError(msg, status, errors, next) {
    const err = new Error(msg);
    err.status = status;
    err.data = errors || null
    return next(err);
}

function AuthenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader && authHeader.split(' ')[1];
    const refreshToken = req.cookies.id_refresh;
    console.log(accessToken); 
    
    if (!accessToken && !refreshToken) {
        const err = new Error('Maaf anda belum login');
        err.status = 401;
        err.data = null;
        return next(err);
    }

    try {
        const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
        req.user = decodedAccessToken.user;
        next()
    } catch (error) {
        handleError("Maaf Akses ditolak", 401, error, next);
    } 
}

module.exports = AuthenticateToken;