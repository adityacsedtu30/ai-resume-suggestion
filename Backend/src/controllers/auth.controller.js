const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")
const blacklistTokenModel = require("../models/blacklistToken.model")
const asyncHandler = require("../utils/asyncHandler")

// Cookie options reused by register / login / logout.
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
}

function signToken(user) {
    return jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
}

function publicUser(user) {
    return { id: user._id, username: user.username, email: user.email }
}

// POST /api/auth/register  (public)
const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Please provide username, email and password" })
    }

    const existing = await userModel.findOne({ $or: [{ username }, { email }] })
    if (existing) {
        return res.status(400).json({ message: "Account already exists with this email address or username" })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await userModel.create({ username, email, password: hash })

    res.cookie("token", signToken(user), COOKIE_OPTIONS)
    res.status(201).json({ message: "User registered successfully", user: publicUser(user) })
})

// POST /api/auth/login  (public)
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password" })
    }

    const user = await userModel.findOne({ email })
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: "Invalid email or password" })
    }

    res.cookie("token", signToken(user), COOKIE_OPTIONS)
    res.status(200).json({ message: "User logged in successfully", user: publicUser(user) })
})

// GET /api/auth/logout  (public)
const logout = asyncHandler(async (req, res) => {
    const token = req.cookies.token
    if (token) {
        await blacklistTokenModel.create({ token })
    }
    res.clearCookie("token", COOKIE_OPTIONS)
    res.status(200).json({ message: "User logged out successfully" })
})

// GET /api/auth/get-me  (private)
const getMe = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user.id)
    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json({ message: "User details fetched successfully", user: publicUser(user) })
})

module.exports = { register, login, logout, getMe }
