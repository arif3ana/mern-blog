const jwt = require("jsonwebtoken");

// jadikan fungsi handleError menjadi middleware untuk menghandle error message
function handleError(msg, status, errors, next) {
    const err = new Error(msg);
    err.status = status;
    err.data = errors || null
    return next(err);
}

function AuthenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const accessToken = authHeader && authHeader.split(' ')[1];
    const refreshToken = req.cookies['refreshToken'];
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
        if (!refreshToken) {
            handleError("Maaf Akses ditolak", 401, error, next);
            return;
        }
    }

    try {
        const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
        const newAccessToken = jwt.sign({user: decodedRefreshToken.user}, process.env.ACCESS_TOKEN_SECRET_KEY, {expiresIn: 1800});

        res
        .cookie('refreshToken', refreshToken, { httpOnly: true })
        .header("Authorization", "Bearer " + newAccessToken);
        next()
    } catch (error) {
        handleError("Invalid Token", 400, error, next);
    }  
}

module.exports = AuthenticateToken;