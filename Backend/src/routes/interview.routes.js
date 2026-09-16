const { Router } = require("express")
const interviewController = require("../controllers/interview.controller")
const { authUser } = require("../middlewares/auth.middleware")
const upload = require("../middlewares/upload.middleware")

const router = Router()

// Every interview route requires a logged-in user.
router.use(authUser)

router.post("/", upload.single("resume"), interviewController.createReport)
router.get("/", interviewController.getReports)
router.get("/report/:interviewId", interviewController.getReportById)
router.post("/resume/pdf/:interviewReportId", interviewController.downloadResumePdf)

module.exports = router
