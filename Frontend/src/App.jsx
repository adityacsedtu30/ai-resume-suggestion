import { RouterProvider } from "react-router"
import { router } from "./routes"
import { AuthProvider } from "./context/AuthContext"

// AuthProvider wraps everything so any page can read the current user.
// Interview data is NOT global anymore - each page fetches what it needs.
export default function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    )
}
