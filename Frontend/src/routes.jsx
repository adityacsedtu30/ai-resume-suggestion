import { createBrowserRouter } from "react-router"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import Interview from "./pages/Interview"
import ProtectedRoute from "./components/ProtectedRoute"

export const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/", element: <Home /> },
    { path: "/interview/:interviewId", element: <ProtectedRoute><Interview /></ProtectedRoute> },
])
