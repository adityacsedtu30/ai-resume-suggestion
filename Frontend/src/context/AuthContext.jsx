import { createContext, useContext, useEffect, useState } from "react"
import * as authApi from "../api/auth.api"
import { clearCache } from "../api/cache"

// Holds the current user for the whole app.
// The "who am I?" request runs ONCE here, when the app mounts -
// not inside a hook that every page calls (that was the old bug).

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true) // true only while the first getMe() runs

    useEffect(() => {
        authApi.getMe()
            .then(data => setUser(data.user))
            .catch(() => setUser(null)) // not logged in
            .finally(() => setLoading(false))
    }, [])

    async function login(credentials) {
        const data = await authApi.login(credentials)
        setUser(data.user)
    }

    async function register(details) {
        const data = await authApi.register(details)
        setUser(data.user)
    }

    async function logout() {
        await authApi.logout()
        setUser(null)
        clearCache() // drop the previous user's cached reports
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// Small helper so pages can do: const { user, login } = useAuth()
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
    return ctx
}
