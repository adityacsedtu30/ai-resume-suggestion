import { api } from "./client"
import { cached, clearCache } from "./cache"

// Create a new interview report from a job description + resume/self description.
// Clears the cached list so the new report shows up when we go back Home.
export async function createReport({ jobDescription, selfDescription, resumeFile }) {
    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    if (resumeFile) formData.append("resume", resumeFile)

    const { data } = await api.post("/api/interview/", formData)
    clearCache("reports")
    return data.interviewReport
}

// List of the logged-in user's reports (cached for this session).
export function getReports() {
    return cached("reports", () =>
        api.get("/api/interview/").then(r => r.data.interviewReports)
    )
}

// A single report by id (each id cached separately).
export function getReportById(id) {
    return cached(`report:${id}`, () =>
        api.get(`/api/interview/report/${id}`).then(r => r.data.interviewReport)
    )
}

// Ask the backend to build a tailored resume PDF and trigger a download.
export async function downloadResumePdf(reportId) {
    const { data } = await api.post(`/api/interview/resume/pdf/${reportId}`, null, {
        responseType: "blob",
    })
    const url = window.URL.createObjectURL(new Blob([data], { type: "application/pdf" }))
    const link = document.createElement("a")
    link.href = url
    link.download = `resume_${reportId}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
}
