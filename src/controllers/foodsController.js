const { Food } = require("../model/db")
const fs = require('fs');
const Path = require("path");
const { validationResult } = require("express-validator");

// GET - Read
const getFood = async (req, res) => {
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

// GET - Read by id
const detailFood = async (req, res, next) => {
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

//Create - Post
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
    .then((result) => res.status(201).json({
        message: "Data berhasil di simpan!!",
        data: result
    }))
    .catch((error) => res.status(400).json({
        message: "Data gagal di simpan!!",
        data: error
    }))
}

// Update - PUT
const updateFood = async (req, res, next) => {
    // Input validasi
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error("Invalid Value");
        err.status = 400;
        err.data = errors.array()
        return next(err)
    }

    //mengambil data yang akan di update
    const idParams = req.params.id;
    const dataUpdate = await Food.findById(idParams);

    // menghandle request image jika ada maupun tidak ada request image
    let {image, img} = req.files;

    //validasi jika ada request image dan jika tidak ada request
    let imagePath; 
    if (!image) {
        imagePath = [dataUpdate.image];
    } else {
        imagePath = image.map(gambar => gambar.path);
        //menghapus image lama
        const imageFullPath = Path.join(__dirname, '../../' + dataUpdate.image);
        fs.unlink(imageFullPath, (err) => {
            if(err) {
                console.error(err);
                const error = new Error("Update gagal");
                error.status = 400;
                return next(error)
            }
        })
    }

    //validasi jika ada request img dan jika tidak ada request
    let imgPath; 
    if (!img) {
        imgPath = dataUpdate.instructions.map(instruction => instruction.img);
    } else {
        // mengisi imagePath dengan img yang baru
        imgPath = img.map(instruction => instruction.path)
        //menghapus img lama
        let imgFullPath = dataUpdate.instructions.map((instruction) => {
            return Path.join(__dirname, '../../' + instruction.img);
        });
        imgFullPath.map((hapusPath)=> {
            if (hapusPath !== Path.join(__dirname, '../../null')) {
                fs.unlink(hapusPath,(err) => {
                    if (err) {
                        console.error(err);
                        const error = new Error("Update gagal");
                        error.status = 400;
                        return next(error)
                    }
                })
            }
        })

    }

    dataUpdate.name = req.body.name;
    dataUpdate.description = req.body.description;
    dataUpdate.image = imagePath[0];
    dataUpdate.ingredients = req.body.ingredients;
    dataUpdate.instructions = req.body.instructions.map(
        (instruction, index) => {
                return {
                    img: imgPath[index], 
                    step: instruction.step
                };
            })

    dataUpdate.save()
    .then((result) => res.status(201).json({
        message: "Data berhasil di Update!!",
        data: result
    }))
    .catch((error) => res.status(400).json({
        message: "Data gagal di Update!!",
        data: error
    }))
}

const deleteFood = async (req, res, next) => {
    const dataId = req.params.id;
    const dataDeleted = await Food.findOneAndDelete(dataId);

    //hapus image dan img
    const imageFullPath = Path.join(__dirname, '../../' + dataDeleted.image);
    fs.unlink(imageFullPath, (err) => {
        if(err) {
            console.error(err);
            const error = new Error("Update gagal");
            error.status = 400;
            return next(error)
        }
    })

    let imgFullPath = dataDeleted.instructions.map((instruction) => {
        return Path.join(__dirname, '../../' + instruction.img);
    });
    imgFullPath.map((hapusPath)=> {
        if (hapusPath !== Path.join(__dirname, '../../null')) {
            fs.unlink(hapusPath,(err) => {
                if (err) {
                    console.error(err);
                    const error = new Error("Update gagal");
                    error.status = 400;
                    return next(error)
                }
            })
        }
    })

    res.status(200).json({
        message: "Data berhasil di hapus!!",
        data: dataDeleted
    })
}

// __dirname: /home/al-arif/Proyek/mern-blog/src/controllers
// imagePath : uploads/mainImg/1697870826229-107731082-arif-profile.jpg

module.exports = {getFood, detailFood, addFood, updateFood, deleteFood}