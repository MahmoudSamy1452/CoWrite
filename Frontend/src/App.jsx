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

function App() {

  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors/>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<AnonymousRoute><SignUp /></AnonymousRoute>} />
        <Route path="/" element={<AnonymousRoute><Login /></AnonymousRoute>} />
        <Route path="/home" element={<PrivateRoute><Documents /></PrivateRoute>} />
        <Route path="/view/:id" element={<PrivateRoute><EditPage /></PrivateRoute>} />
        <Route path="/history/:id" element={<PrivateRoute><History /></PrivateRoute>} />
        <Route path="/version/:id" element={<PrivateRoute><ViewVersion /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App