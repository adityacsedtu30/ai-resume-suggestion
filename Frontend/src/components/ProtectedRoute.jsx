import { Navigate } from "react-router"
import { useAuth } from "../context/AuthContext"

// Wrap any route that needs a logged-in user.
// While the first getMe() is still running we show a short message;
// after that we either render the page or bounce to /login.
export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) return <main className="centered">Checking your session…</main>
    if (!user) return <Navigate to="/login" replace />

    return children
}
