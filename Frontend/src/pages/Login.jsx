import { useState } from "react"
import { useNavigate, Link } from "react-router"
import { useAuth } from "../context/AuthContext"
import "../styles/auth.scss"

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        setSubmitting(true)
        setError("")
        try {
            await login({ email, password })
            navigate("/")
        } catch (err) {
            setError(err?.response?.data?.message || "Login failed. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Enter email address"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter password"
                        />
                    </div>
                    {error && <p className="form-error">{error}</p>}
                    <button className="button primary-button" disabled={submitting}>
                        {submitting ? "Logging in…" : "Login"}
                    </button>
                </form>
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </main>
    )
}
