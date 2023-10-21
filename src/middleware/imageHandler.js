const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = file.fieldname === "image" ? "mainImg" : "img";
        cb(null, `uploads/${dir}`); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix+"-"+file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" || 
        file.mimetype === "image/jpg" || 
        file.mimetype === "image/jpeg" || 
        file.mimetype === "image/webp" ||
        file.mimetype === "img/png" || 
        file.mimetype === "img/jpg" || 
        file.mimetype === "img/jpeg" || 
        file.mimetype === "img/webp"
        ) 
    {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({storage: storage, fileFilter: fileFilter})

module.exports = upload 