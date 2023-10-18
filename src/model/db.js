const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/foods", {autoIndex: true})
.then(() => console.log("Conected success!!"));

const User = mongoose.model("User", {
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    }
});

module.exports = User