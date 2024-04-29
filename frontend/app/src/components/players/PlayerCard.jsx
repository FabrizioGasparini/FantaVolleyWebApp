import './PlayerCard.css'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

const PlayerCard = (props) => {
    const navigate = useNavigate()
    
    const handleOnDrag = (e, player) => {
        e.dataTransfer.setData('player', JSON.stringify(player))
        e.dataTransfer.setData('court_position', (props.court_position).toString())
    }

    return (
        props.big ? (
            <div className={props.player == null ? "player-card big" : "player-card big hidden"} onClick={() => {props.onClick()}} > 
                {props.player == null ?
                    <p>?</p> : <img src={`${props.player['url_card']}`} alt={props.player["nome"]}/>
                }
            </div>
        ) : (
                <div className={props.small ? "player-card small" : "player-card"} onClick={props.onClick != null ? () => { props.onClick() }  : () => { navigate(`/players/${props.player["codice"]}`) }} onDragStart={props.draggable ? (e) => handleOnDrag(e, props.player) : () => {}}> 
                <img src={`${props.player['url_card']}`} alt={props.player["nome"]}/>
            </div>
        )
    );
};

PlayerCard.propTypes = {
    player: PropTypes.object,
    small: PropTypes.bool,
    big : PropTypes.bool,
    draggable: PropTypes.bool,
    court_position: PropTypes.number,
    onDragEnd: PropTypes.func,
    onClick: PropTypes.func
}

export default PlayerCard;