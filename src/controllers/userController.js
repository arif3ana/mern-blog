const { Food } = require("../model/db")

const getRecipe = (req, res, next) => {
    Food.find()
    .then((result) => {
        if (result.length === 0) {
            const err = new Error("Data Makanan Belum ada");
            err.status = 404;
            err.data = result;
            return next(err)
        } 

        res.status(200).json({
            message: "Data Makanan berhasil di tampilkan",
            data: result
        })
    })
    .catch((error) => {
        const err = new Error("Data Makanan Belum ada");
        err.status = 404;
        err.data = error;
        return next(err)
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