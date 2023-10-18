const express = require("express");
const foodController = require('../controllers/foods');
const app = express();

app.get('/food', foodController.getFood);

module.exports = app