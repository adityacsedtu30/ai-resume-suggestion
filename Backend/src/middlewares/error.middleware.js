// Central error handler. Any error passed to next(err) ends up here,
// so controllers don't each need their own try/catch.
function errorHandler(err, req, res, next) {
    console.error(err)

    // Multer file-size / upload errors
    if (err.name === "MulterError") {
        return res.status(400).json({ message: err.message })
    }

    const status = err.status || 500
    res.status(status).json({
        message: err.message || "Something went wrong on the server.",
    })
}

module.exports = errorHandler
