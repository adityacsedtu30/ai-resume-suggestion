const { Router } = require("express")
const authController = require("../controllers/auth.controller")
const { authUser } = require("../middlewares/auth.middleware")

const router = Router()

router.post("/register", authController.register)          // public
router.post("/login", authController.login)                // public
router.get("/logout", authController.logout)               // public
router.get("/get-me", authUser, authController.getMe)      // private

module.exports = router
