const mongoose = require("mongoose")

// Connect once at startup. If it fails we stop the process instead of
// running a server that can't reach the database.
async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to database")
    } catch (err) {
        console.error("Database connection failed:", err.message)
        process.exit(1)
    }
}

module.exports = connectToDB
