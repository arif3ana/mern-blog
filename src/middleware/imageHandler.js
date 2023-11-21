const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = file.fieldname === "image" ? "mainImg" : "img";
        const uploadPath = `uploads/${dir}`

        // Membuat folder jika belum ada
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix+"-"+file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    const imageMimeTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
    const imgMimeTypes = ["img/png", "img/jpg", "img/jpeg", "img/webp"];
    
    if (imageMimeTypes.includes(file.mimetype) || imgMimeTypes.includes(file.mimetype)) 
    {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({storage: storage, fileFilter: fileFilter})

module.exports = upload 