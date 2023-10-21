const { Food } = require("../model/db")
const { validationResult } = require("express-validator");
const { path } = require("../routes/route");

const getFood = async (req, res) => {
    const data = await Food.find();
    res.status(200).json(data)
}

const addFood = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error("Invalid Value");
        err.status = 400;
        err.data = errors.array()
        return next(err)
    }

    const {image, img} = req.files;
    // validasi apakah image ada
    if (!image) {
        const err = new Error("Image harus di isi");
        err.status = 422;
        return next(err)
    }

    const imagePath = image.map(gambar => gambar.path);
    let imgPath = !img ? null : img.map(gambar => gambar.path);

    const dataFood = {
        name: req.body.name,
        description: req.body.description,
        image: imagePath[0],
        ingredients: req.body.ingredients,
        instructions: req.body.instructions.map((instruction, index) => {
            return {
                img: imgPath == null ? null : imgPath[index], 
                step: instruction.step
            };
        })
    }

    const newData = new Food(dataFood);
    newData.save()
    .then(() => res.status(201).json({
        message: "Data berhasil di simpan!!",
        data: dataFood
    }))
    .catch((error) => res.status(400).json({
        message: "Data gagal di simpan!!",
        data: error
    }))
}

module.exports = {getFood, addFood}