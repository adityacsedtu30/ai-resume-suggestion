const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const authRoutes = require("./routes/auth.routes")
const interviewRoutes = require("./routes/interview.routes")
const errorHandler = require("./middlewares/error.middleware")

const app = express()

// ── Global middleware ────────────────────────────────────────────────
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}))

// ── Routes ───────────────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ status: "ok" })) // health check
app.use("/api/auth", authRoutes)
app.use("/api/interview", interviewRoutes)

// ── Error handler (must be last) ─────────────────────────────────────
app.use(errorHandler)

module.exports = app
