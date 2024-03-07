import './LeagueCard.css'
import Shirt from '../../assets/images/shirt.svg'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import PopupDialog from '../popup/PopupDialog'
import { useState } from 'react'
import axios from '../../api/axios'
import Cookies from "universal-cookie";

const cookies = new Cookies()

const LeagueCard = (props) => {
    const [popupVisible, setPopupVisible] = useState(false)
    const [error, setError] = useState('')
    
    const participants = props.league != undefined ? props.league.participants.length : 0

    const deleteLeague = async () => {
        try
        {
            await axios.post('/api/v1/leagues/delete', { 'invite_code': props.league.invite_code }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setPopupVisible(false)
            setError('')
            window.location.reload(false)
        }
        catch (error) {
            console.error('Error during request:', error);
            setError(error.response.data.error.message);
        }
    }

    const leaveLeague = async () => {
        try
        {
            await axios.post('/api/v1/leagues/leave', { 'invite_code': props.league.invite_code }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setPopupVisible(false)
            setError('')
            window.location.reload(false)
        }
        catch (error) {
            console.error('Error during request:', error);
            setError(error.response.data.error.message);
        }
    }

    return (
        props.league != undefined ? (
            <>
                <div className={props.small ? "league-card small" : "league-card"} onClick={props.onClick}> 
                    <p className='league-name'>{props.league.name}</p>
                    <p className='league-points'><span>0.0</span>FPT</p>
                    <p className='league-count'><span>{participants}</span> {participants == 1 ? "Partecipante" : "Partecipanti" }</p>
                    <img src={Shirt} alt="" className="league-jersey" />
                    {
                        !props.disableSettings ?
                            <FontAwesomeIcon className="league-settings" icon={faEllipsisV} onClick={(e) => {
                                e.stopPropagation();
                                setPopupVisible(true)
                            }} style={{ width: '40px' }} /> : ''
                    }
                </div>

                <PopupDialog trigger={popupVisible} onClose={() => setPopupVisible(false)} title="Impostazioni Lega">
                    <div className="stats">
                        <div className="stat">
                            <div className="info title">Nome</div>
                            <input type="text" disabled className="text-input info" value={props.league.name} style={{fontWeight: 'bold'}}/>
                        </div>
                        <p className="error-message" style={{margin: '0px'}}>{error}</p>
                        <div className="stat large">
                            {props.league.owner_token == cookies.get('token') ? (
                                <div className="info red" onClick={() => deleteLeague()}>ELIMINA LEGA</div>
                            ) : (
                                <div className="info red" onClick={() => leaveLeague()}>ABBANDONA LEGA</div>      
                            )}
                        </div>
                    </div>
                </PopupDialog> 
            </>
        ) : (
            <div className="league-card add" onClick={props.onClick}> 
                <p>+</p>
            </div>   
        )
    );
};

LeagueCard.propTypes = {
    league: PropTypes.any.isRequired,
    onClick: PropTypes.func.isRequired,
    disableSettings: PropTypes.bool,
    small: PropTypes.bool
};

export default LeagueCard;