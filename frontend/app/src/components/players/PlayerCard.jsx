import './PlayerCard.css'

const PlayerCard = (player) => {
    return (
        <div className="player-card">
            <img src={`${player.player['url_card']}`} alt={player.player["nome"]} />
        </div>
    );
};

export default PlayerCard;