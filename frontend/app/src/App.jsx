import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoute";
import Home from "./pages/Home"
import Login from "./pages/Login"
import Account from './pages/Account';
import Players from './pages/Players';
import PlayerDetails from './pages/dynamic/player/PlayerDetails';
import Logout from './pages/Logout';
import Leagues from './pages/Leagues';
import Stats from './pages/Stats';
import Rules from './pages/Rules';
import League from './pages/dynamic/league/League';

function App()
{

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<Account/>} path="/account" />
            <Route element={<Leagues />} path="/leagues" />
            <Route element={<League />} path="/leagues/:invite_code" />
          </Route>
          <Route element={<Home/>} path="/" />
          <Route element={<Stats />} path="/stats" />
          <Route element={<Players />} path="/players" />
          <Route element={<PlayerDetails />} path="/players/:id" />
          <Route element={<Rules />} path="/rules" />
          <Route element={<Login />} path="/login" />
          <Route element={<Logout/>} path="/logout" />
        </Routes>
      </Router>
    </div>
  )
}

export default App;