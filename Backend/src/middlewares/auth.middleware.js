const jwt = require("jsonwebtoken")
const blacklistTokenModel = require("../models/blacklistToken.model")

// Reads the auth cookie, rejects missing / blacklisted / invalid tokens,
// and puts the decoded payload on req.user for the controllers.
async function authUser(req, res, next) {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: "Token not provided." })
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token })
    if (isBlacklisted) {
        return res.status(401).json({ message: "Token is invalid." })
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (err) {
        return res.status(401).json({ message: "Invalid token." })
    }
}

module.exports = { authUser }
