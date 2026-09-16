const mongoose = require("mongoose")

// Logged-out tokens live here so they can't be reused until they expire.
const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "token is required to be added in blacklist"],
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model("blacklistTokens", blacklistTokenSchema)
