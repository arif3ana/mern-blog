function userRegister(req, res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const result = {
        message: "Register success!!",
        data: {
            username,
            email,
            password
        }
    }

    res.status(201).json(result);
}

module.exports = {userRegister}