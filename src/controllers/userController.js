const { Food } = require("../model/db")

const getRecipe = async (req, res) => {
    const data = await Food.find();
    if (!data) {
        const err = new Error("Data Makanan Belum ada");
        err.status = 404;
        return next(err)
    }

    res.status(200).json({
        message: "Data Makanan berhasil di tampilkan",
        data: data
    })
}

const detailRecipe = async (req, res, next) => {
    const foodId = req.params.id
    const detailData = await Food.findById(foodId);
    if (!detailData) {
        const err = new Error("Resep Makanan Tidak Di temukan");
        err.status = 404;
        return next(err)
    }
    res.status(200).json({
        message: "Resep Makanan berhasil di temukan",
        data: detailData
    })
}

module.exports = {getRecipe, detailRecipe}