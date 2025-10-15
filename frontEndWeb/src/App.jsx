import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./components/protectedRoute"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import EditProfile from "./pages/EditProfile"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={< Login />} />
        <Route path="/register" element={< Register />} />
        <Route path="/profile" element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
        <Route path="/editProfile" element={<ProtectedRoute>  <EditProfile /> </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}



export default App
