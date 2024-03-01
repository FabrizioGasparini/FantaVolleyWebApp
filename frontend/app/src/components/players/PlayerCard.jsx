import './PlayerCard.css'
import { useNavigate } from 'react-router-dom'

const PlayerCard = (player) => {
    const navigate = useNavigate()
    
    return (
        <div className="player-card" onClick={() => { navigate(`${player.player["codice"]}`) }} > 
            <img src={`${player.player['url_card']}`} alt={player.player["nome"]} />
        </div>
    );
};

export default PlayerCard;