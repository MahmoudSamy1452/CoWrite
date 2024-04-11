import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
import EditPage from "./pages/EditPage"
import Documents from "./pages/Documents"
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Documents />} />
        <Route path="/edit" element={<EditPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App