// multer handles upload and storage of information
const multer = require("multer");
const path = require("path");

// storage function handles the storage info of uploaded information
const storage = multer.diskStorage({
    // destinating the file to uploads folder
    destination:function (req, file, cb) {
        cb(null, "uploads/")
    },
    // destinating how the file will be saved
    // filename-date uploaded and extention of the file originally
    filename:function (req, file, cb) {
        const ext = path.extname(file.originalname)
        cb(null,`${file.fieldname}-${Date.now()}${ext}`)
    }
})

// storing the storage in multer, assigning it to upload
const upload = multer({storage:storage});

module.exports = upload;