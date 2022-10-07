const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,"./../Images");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname);
    }
})

const Upload = multer({ storage: storage });

module.exports = Upload;