const pdfParse = require("pdf-parse")
const aiService = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")
const asyncHandler = require("../utils/asyncHandler")

// Fields hidden from the list view (only needed on the detail page).
const LIST_HIDDEN_FIELDS = "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan"

// POST /api/interview/  (private)  - generate a new report
const createReport = asyncHandler(async (req, res) => {
    const { selfDescription, jobDescription } = req.body

    if (!jobDescription) {
        return res.status(400).json({ message: "Job description is required" })
    }
    if (!req.file && !selfDescription) {
        return res.status(400).json({ message: "Upload a resume or provide a self description" })
    }

    let resumeText = ""
    if (req.file) {
        const parsed = await new pdfParse.PDFParse(Uint8Array.from(req.file.buffer)).getText()
        resumeText = parsed.text
    }

    const aiReport = await aiService.generateInterviewReport({
        resume: resumeText,
        selfDescription,
        jobDescription,
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeText,
        selfDescription,
        jobDescription,
        ...aiReport,
    })

    res.status(201).json({ message: "Interview report generated successfully", interviewReport })
})

// GET /api/interview/report/:interviewId  (private)
const getReportById = asyncHandler(async (req, res) => {
    const interviewReport = await interviewReportModel.findOne({
        _id: req.params.interviewId,
        user: req.user.id,
    })

    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found" })
    }

    res.status(200).json({ message: "Interview report fetched successfully", interviewReport })
})

// GET /api/interview/  (private)  - list the user's reports
const getReports = asyncHandler(async (req, res) => {
    const interviewReports = await interviewReportModel
        .find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .select(LIST_HIDDEN_FIELDS)

    res.status(200).json({ message: "Interview reports fetched successfully", interviewReports })
})

// POST /api/interview/resume/pdf/:interviewReportId  (private)
const downloadResumePdf = asyncHandler(async (req, res) => {
    const interviewReport = await interviewReportModel.findOne({
        _id: req.params.interviewReportId,
        user: req.user.id,
    })

    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found" })
    }

    const { resume, jobDescription, selfDescription } = interviewReport
    const pdfBuffer = await aiService.generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReport._id}.pdf`,
    })
    res.send(pdfBuffer)
})

module.exports = { createReport, getReportById, getReports, downloadResumePdf }
