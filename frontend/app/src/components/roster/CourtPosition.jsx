import PropTypes from 'prop-types'
import './CourtPosition.css'
import axios from '../../api/axios';
import { useEffect, useState } from 'react';

const CourtPosition = (props) =>
{
    const [player, setPlayer] = useState(props.player)

    useEffect(() => {
        const setDefaultPlayer = async () => {
            setPlayer(props.player)
        }

        setDefaultPlayer()
    }, [])


    const updateRoster = async(dropped_player, court_position) => {
        try {
            await axios.post(`/api/v1/rosters/update/${court_position}`, { 'league_code': props.league_code, 'player_id': dropped_player.id }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            props.onDrop()
        }
        catch (error)
        {
            console.error('Error during request:', error);
        }
    }

    const handleDrop = async (e) => {
        const dropped_player = JSON.parse(e.dataTransfer.getData("player"));
        const court_position = e.dataTransfer.getData("court_position");

        if (dropped_player != null && court_position != props.court_position)
        {
            if (dropped_player.ruolo == props.role)
            {
                if (player != null) updateRoster(player, court_position)
                    
                updateRoster(dropped_player, props.court_position)
                setPlayer(dropped_player)
            }
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
    }


    return (
        <div className={props.className}  onDrop={handleDrop} onDragOver={handleDragOver}>
            <p className="role">{props.role}</p>
            {props.children}
        </div>
    )
}

CourtPosition.propTypes = {
    role: PropTypes.string,
    court_position: PropTypes.number,
    league_code: PropTypes.string,
    player: PropTypes.object,
    children: PropTypes.node.isRequired,
    onDrop: PropTypes.func,
    className: PropTypes.string
}

export default CourtPosition;