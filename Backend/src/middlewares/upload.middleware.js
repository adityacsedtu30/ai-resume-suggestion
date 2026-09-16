const multer = require("multer")

// Keeps the uploaded resume in memory as a Buffer (req.file.buffer)
// so the controller can parse it without writing to disk.
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024, // 3 MB
    },
})

module.exports = upload
