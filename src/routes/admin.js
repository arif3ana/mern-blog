const express = require("express");
const foodController = require('../controllers/foodsController');
const { body } = require("express-validator");
const app = express();
const upload = require("../middleware/imageHandler");

app.get('/food', foodController.getFood);
app.get("/food/:id", foodController.detailFood);
app.get('/food/author/:user', foodController.getFoodByName);
app.post("/food/add-food",
upload.fields([
    {name: "image", maxCount: 1}, 
    {name: "img", maxCount: 10}
  ]),
[
    body("name").notEmpty().escape().withMessage("Nama makanan belum di isi"),
    body("description").escape().isLength({min: 200}).withMessage("Deskripsi minimal 200 karakter"),
    body("ingredients").notEmpty().escape().withMessage("Ingredient harus di isi"),
], 
foodController.addFood);
app.put("/food/update/:id",
upload.fields([
    {name: "image", maxCount: 1}, 
    {name: "img", maxCount: 10}
  ]),
[
    body("name").notEmpty().escape().withMessage("Nama makanan belum di isi"),
    body("description").escape().isLength({min: 200}).withMessage("Deskripsi minimal 200 karakter"),
    body("ingredients").notEmpty().escape().withMessage("Ingredient harus di isi"),
],
foodController.updateFood);
app.delete("/food/delete/:id", foodController.deleteFood);

module.exports = app