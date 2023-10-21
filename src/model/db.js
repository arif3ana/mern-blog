const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/foods", {autoIndex: true})
.then(() => console.log("Conected success!!"));

const User = mongoose.model("User", {
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});


const Food = mongoose.model("Food", {
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type:String,
        required: true
    },
    ingredients: {
        type: [String],
        required: true
    },
    instructions: [
        {
            img: String,
            step: {
                type: String,
                required: true
            } 
        }
    ]

})

module.exports = { User, Food }