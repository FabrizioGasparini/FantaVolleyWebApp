import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoute";
import Home from "./pages/Home"
import Login from "./pages/Login"
import Account from './pages/Account';
import Players from './pages/Players';

function App()
{
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route element={<PrivateRoutes/>}>
            <Route element={<Home/>} path="/" />
            <Route element={<Account/>} path="/account" />
            <Route element={<Players/>} path="/players" />
          </Route>
          <Route element={<Login/>} path="/login" />
        </Routes>
      </Router>
    </div>
  )
}

export default App;