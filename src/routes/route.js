const express = require("express");
const foodController = require('../controllers/foods');
const { body } = require("express-validator");
const app = express();

app.get('/', foodController.getFood);
app.post("/add-food",
[
    body("name").notEmpty().escape().withMessage("Nama makanan belum di isi"),
    body("description").escape().isLength({min: 200}).withMessage("Deskripsi minimal 200 karakter"),
    body("ingredients").notEmpty().escape().withMessage("Ingredient harus di isi"),
], 
foodController.addFood)

module.exports = app