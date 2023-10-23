const express = require("express");
const userController = require("../controllers/userController");
const app = express();

app.get("/recipe", userController.getRecipe);
app.get("/recipe/:id", userController.detailRecipe);

module.exports = app