const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb("images Folder Not Read as Destination","Images");
    },
    filename: (req, res, cb) => {
        cb(null, req.body.file);
    }
})

const Upload = multer({ storage: storage });

module.exports = Upload;