import Sidebar from "../components/sidebar/Sidebar";
import './css/Players.css'
import PlayersList from '../components/players/PlayersList';

const Players = () => {


    return (
        <Sidebar>
            <h1 className='header'>Giocatori</h1>
            <PlayersList />
        </Sidebar>
    )
}

export default Players;