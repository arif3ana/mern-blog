const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URI, {autoIndex: true})
.then(() => console.log("Conected success!!"))
.catch((error) => console.log(error))

const User = mongoose.model("User", {
    username: {
        type: String,
        required: true,
        unique: 1
    },
    email: {
        type: String,
        required: true,
        unique: 1
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
    ],
    author: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
    }

})

module.exports = { User, Food }