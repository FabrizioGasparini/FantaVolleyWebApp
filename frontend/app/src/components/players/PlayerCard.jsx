import './PlayerCard.css'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useState } from 'react';

const PlayerCard = (props) => {
    const navigate = useNavigate()
    const [dragged, setDragged] = useState(false)
    
    const handleOnDrag = (e, player) => {
        e.dataTransfer.setData('player', JSON.stringify(player))
        e.dataTransfer.setData('court_position', (props.court_position).toString())
        setDragged(true)
    }

    return (
        <div id={dragged ? "dragged" : ""} className={props.small ? "player-card small" : "player-card"} onClick={() => { navigate(`/players/${props.player["codice"]}`) }} onDragStart={props.draggable ? (e) => handleOnDrag(e, props.player) : ''}> 
            <img src={`${props.player['url_card']}`} alt={props.player["nome"]} />
        </div>
    );
};

PlayerCard.propTypes = {
    player: PropTypes.object.isRequired,
    small: PropTypes.bool,
    draggable: PropTypes.bool,
    court_position: PropTypes.number,
    onDragEnd: PropTypes.func
}

export default PlayerCard;