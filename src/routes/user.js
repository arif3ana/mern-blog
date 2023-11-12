const express = require("express");
const userController = require("../controllers/userController");
const app = express();

app.get("/recipe", userController.getRecipe);

module.exports = app