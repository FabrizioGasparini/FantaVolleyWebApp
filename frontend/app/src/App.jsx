import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoute";
import Home from "./pages/Home"
import Login from "./pages/Login"

function App()
{
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<Home/>} path="/"></Route>
          </Route>
          <Route element={<Login />} path="/login" />
        </Routes>
      </Router>
    </div>
  )
}

export default App;