import axios from "axios"

// One axios instance for the whole app.
// baseURL can be overridden with VITE_API_URL when running locally.
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://ai-resume-suggestion.onrender.com",
    withCredentials: true, // send the auth cookie on every request
})
