import { api } from "./client"

// Each function talks to one endpoint and returns response.data.
// Errors are thrown so the caller (AuthContext) can show a message.

export function register({ username, email, password }) {
    return api.post("/api/auth/register", { username, email, password }).then(r => r.data)
}

export function login({ email, password }) {
    return api.post("/api/auth/login", { email, password }).then(r => r.data)
}

export function logout() {
    return api.get("/api/auth/logout").then(r => r.data)
}

export function getMe() {
    return api.get("/api/auth/get-me").then(r => r.data)
}
