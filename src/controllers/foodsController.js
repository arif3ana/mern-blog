const { Food, User } = require("../model/db")
const { validationResult } = require("express-validator");
const { uploader } = require('cloudinary').v2;
const fs = require('fs');
const Path = require("path");
const jwt = require("jsonwebtoken");

// GET - Read
const getFood = (req, res, next) => {
    Food.find()
    .sort({createdAt: -1})
    .then((result) => {
        if (result.length === 0) {
            res.status(200).json({
                data: {
                    msg: "Data Makanan Belum ada"
                },
            })
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

// GET - Read by id
const detailFood = (req, res, next) => {
    const foodId = req.params.id
    Food.findById(foodId)
    .then((result) => {
        res.status(200).json({
            message: "Resep Makanan berhasil di temukan",
            data: result
        })
    })
    .catch((error) => {
        const err = new Error("Resep Makanan Tidak Di temukan");
        err.status = 404;
        err.data = error;
        return next(err)
    })
}

const getFoodByName = (req, res, next) => {
    const userId = req.params.user;
    Food.find({author: userId})
    .sort({createdAt: -1})
    .then((result) => {
        if (result.length === 0) {
            const err = new Error(`${userId} belum menambahkan resep`);
            err.status = 404;
            return next(err)
        }
        res.status(200).json({
            message: `Resep ${userId} berhasil di temukan`,
            data: result
        })
    })
    .catch((error) => {
        const err = new Error(`Error ketika memuat data`);
        err.status = 404;
        err.data = error;
        return next(err)
    })
}

// fungsi untuk menghapus gambar
const deleteCloudinaryImage = async (url) => {
    // extract public_id cloudinary 
    const parts = url.split('/'); // pisahkan string berdasarkan / 
    const lastPart = parts[parts.length - 1]; // ambil urutan terakhir dari array parts
    const folderName = parts[parts.length - 2]; // ambil nama folder dari url 
    const imageId = lastPart.split('.')[0]; // memisahkan id dengan exstensi file

    try {
        const public_id = `${folderName}/${imageId}`
        await uploader.destroy(public_id);
    } catch (error) {
        console.error(`Gagal menghapus gambar dari Cloudinary: ${error.message}`);
    }
}

//Create - Post
const addFood = async (req, res, next) => {
    const errors = validationResult(req);
    const {image, img} = req.files;
    if (!errors.isEmpty()) {
        //menghapus image dan img ketika validation error
        if (image) {
            const imageError = image[0].path;
            await deleteCloudinaryImage(imageError);
        }

        if (img) {
            img.map(async gambar => {
                await deleteCloudinaryImage(gambar.path);
            })
        }

        const err = new Error("Invalid Value");
        err.status = 400;
        err.data = errors.array()
        return next(err)
    }


    // validasi apakah image ada
    if (!image) {
        const err = new Error("Image harus di isi");
        err.status = 422;
        return next(err)
    }

    const imagePath = image.map(gambar => gambar.path);
    let imgPath = !img ? null : img.map(gambar => gambar.path);
    const reqImg = req.body.instructions.map(instruc => instruc.img);

    function arrayReplace(a, b) {
        for (let i = 0; i < a.length; i++) {
            if (a[i] === undefined && b.length > 0) {
                a[i] = b.shift();
            }
        }

        if (b) {
            while (b.length > 0) {
                a.push(b.shift());
            }   
        }

    }

    arrayReplace(reqImg, imgPath);
    const listImg = reqImg; // list img dari gambar dan keterangan null di instruction img

    let userData;
    try {
        const id = req.cookies.id_refresh;
        const userId = jwt.verify(id, process.env.REFRESH_TOKEN_SECRET_KEY)
        userData = await User.findById(userId.user)
    } catch (error) {
        const err = new Error("Data tidak di temukan");
        err.status = 404;
        err.data = error
        return next(err)
    }
    const username = userData.username // nama user untuk field author

    const dataFood = {
        name: req.body.name,
        description: req.body.description,
        image: imagePath[0],
        ingredients: req.body.ingredients,
        instructions: req.body.instructions.map((instruction, index) => {
            return {
                img: listImg[index] === 'null' ? null : listImg[index], 
                step: instruction.step
            };
        }),
        author: username,
        createdAt: new Date()
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
    const {image, img} = req.files;
    if (!errors.isEmpty()) {

        //menghapus image dan img ketika validation error
        if (image) {
            const imageError = image[0].path;
            await deleteCloudinaryImage(imageError);
        }

        if (img) {
            img.map( async gambar => {
                await deleteCloudinaryImage(gambar.path);
            })
        }

        const err = new Error("Invalid Value");
        err.status = 400;
        err.data = errors.array()
        return next(err)
    }

    //mengambil data yang akan di update
    let dataUpdate;
    try {
        const idParams = req.params.id;
        dataUpdate = await Food.findById(idParams);
    } catch (error) {
        const err = new Error("Data tidak di temukan");
        err.status = 404;
        err.data = error
        return next(err)
    }

    // validasi jika ada request image dan jika tidak ada request
    let imagePath; 
    if (!image) {
        imagePath = [dataUpdate.image];
    } else {
        imagePath = image.map(gambar => gambar.path);
        //menghapus image lama
        await deleteCloudinaryImage(dataUpdate.image);
    }

    //mengambil img 
    const newImg = img ? img.map(newInstruc => newInstruc.path) : null;
    // mengambil path img yang sudah ada di request body
    const oldImg = req.body.instructions.map(oldInstruc => oldInstruc.img);
    // mengambil path img dari db
    const dbImg = dataUpdate.instructions.map(instruction => instruction.img);
    
    // fungsi untuk mengecek keidentikan array dbimg dan oldimg
    async function arraysAreEqual(arr1, arr2) {
        //cek panjang array
        if (arr1.length !== arr2.length) {
          return false;
        }
        // cek isi array 
        for (let i = 0; i < arr1.length; i++) {
          if (arr1[i] !== arr2[i]) {
            //menghapus dbimg jika ada nilai dbimg yang tidak sama dengan oldimg
            let deletePath = arr1[i]
            if (deletePath !== null) {
                await deleteCloudinaryImage(deletePath);
            }
            return false;
          }
        }
        return true;
      }

      // menggabungkan oldImg dengan newImg
      function arrayReplace(a, b) {
        for (let i = 0; i < a.length; i++) {
            if (a[i] === undefined && b.length > 0) {
                a[i] = b.shift();
            }
        }
        while (b.length > 0) {
            a.push(b.shift());
        }
      }

    let reqImg;
    if (arraysAreEqual(dbImg, oldImg)) {
        if(!newImg) {
            reqImg = dbImg; //ketika tidak ada yang di ubah
        } else {
            //ketika ada yang di tambahkan 
            arrayReplace(oldImg, newImg);
            reqImg = oldImg;
        }
    } else {
        //ketika tidak identik yang artinya ada data lama yang di ubah dan mungkin di tambahkan
        arrayReplace(oldImg, newImg);
        reqImg = oldImg;
    }

    dataUpdate.name = req.body.name;
    dataUpdate.description = req.body.description;
    dataUpdate.image = imagePath[0];
    dataUpdate.ingredients = req.body.ingredients;
    dataUpdate.instructions = req.body.instructions.map(
        (instruction, index) => {
                return {
                    img: reqImg[index], 
                    step: instruction.step
                };
            })
    dataUpdate.author = dataUpdate.author,
    dataUpdate.createdAt = dataUpdate.createdAt

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
    let dataDeleted ;
    try {
        const dataId = req.params.id;
        dataDeleted = await Food.findById(dataId);
    } catch (error) {
        const err = new Error("Data tidak di temukan");
        err.status = 404;
        err.data = error
        return next(err)
    }
    
    // hapus image
    const imageFullPath = dataDeleted.image;
    if (imageFullPath !== null) {
        await deleteCloudinaryImage(imageFullPath);
    } else {
        // handle ketika image sama dengan null
        const error = new Error("Deleted gagal");
        error.status = 400;
        return next(error)
    }
    // hapus img
    dataDeleted.instructions.map(async (instruction) => {
        if (instruction.img !== null) {
            await deleteCloudinaryImage(instruction.img);
        }
    });

    // deleted data 
    Food.deleteOne({_id: dataDeleted._id})
    .then((result) => {
        res.status(200).json({
            message: "Data Berhasil dihapus!!",
            data: result
        })
    })
    .catch((error) => {
        const err = new Error("Data Gagal dihapus");
        err.status = 404;
        err.data = error
        return next(err)
    })

}

module.exports = {getFood, detailFood, addFood, updateFood, deleteFood, getFoodByName}