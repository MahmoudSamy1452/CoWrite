import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
import EditPage from "./pages/EditPage"
import Documents from "./pages/Documents"
import History from "./pages/History"
import ViewVersion from "./pages/ViewVersion"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import Navbar from "./components/Navbar"
import PrivateRoute from "./components/PrivateRoute"
import AnonymousRoute from "./components/AnonymousRoute"
import { useState } from "react"

function App() {
  const [title, setTitle] = useState("CoWrite")
  const [userRole, setUserRole] = useState(null)
  const [usernames, setUsernames] = useState([])

  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors/>
      <Navbar title={title} userRole={userRole} usernames={usernames}/>
      <Routes>
        <Route path="/signup" element={<AnonymousRoute><SignUp /></AnonymousRoute>} />
        <Route path="/" element={<AnonymousRoute><Login /></AnonymousRoute>} />
        <Route path="/home" element={<PrivateRoute><Documents setTitle={setTitle} setUserRole={setUserRole}/></PrivateRoute>}/>
        <Route path="/view/:id" element={<PrivateRoute><EditPage setTitle={setTitle} setUserRole={setUserRole} setUsernames={setUsernames}/></PrivateRoute>} />
        <Route path="/history/:id" element={<PrivateRoute><History /></PrivateRoute>} />
        <Route path="/version/:id" element={<PrivateRoute><ViewVersion /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App