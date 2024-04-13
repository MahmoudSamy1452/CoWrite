import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
import EditPage from "./pages/EditPage"
import Documents from "./pages/Documents"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import PrivateRoute from "./components/PrivateRoute"
import AnonymousRoute from "./components/AnonymousRoute"

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<AnonymousRoute><SignUp /></AnonymousRoute>} />
        <Route path="/login" element={<AnonymousRoute><Login /></AnonymousRoute>} />
        <Route path="/home" element={<PrivateRoute><Documents /></PrivateRoute>} />
        <Route path="/edit" element={<PrivateRoute><EditPage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App