import './Auction.css'
import Sidebar from '../../../../components/sidebar/Sidebar';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import axios from '../../../../api/axios';
//import PlayerCard from '../../../../components/players/PlayerCard';
import PopupDialog from '../../../../components/popup/PopupDialog';
import PlayersList from '../../../../components/players/PlayersList';
import PlayerCard from '../../../../components/players/PlayerCard';
import PropTypes from 'prop-types'

const cookies = new Cookies()

const Auction = ({socket}) => {
    const { invite_code } = useParams()
    
    const [league, setLeague] = useState({})
    const [isOwner, setIsOwner] = useState(false)
    const [isAuctionStarted, setIsAuctionStarted] = useState(false)
    
    const [popupVisible, setPopupVisible] = useState(false)
    
    const [selectedPlayer, setSelectedPlayer] = useState(null)
    
    
    const selectPlayer = (player) => {
        setSelectedPlayer(player)
        setPopupVisible(false)
        
        console.log(socket.emit("data", player))
        
        console.log("Player Selected")
    }
    
    useEffect(() => {
        const getLeagues = async () => {
            const token = cookies.get("token")
            axios.defaults.headers.common = { 'Authorization': `Bearer ${token}` }
            
            const response = await axios.get(`api/v1/leagues/read/${invite_code}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            
            setLeague(response.data.league)
            
            if (response.data.league.owner_token == token) setIsOwner(true)
            if (response.data.league.current_auction != "") setIsAuctionStarted(true)
        }
        getLeagues()
    }, [])

    useEffect(() => {
        console.log(socket)

        socket.on("data", (data) => {
            //setSelectedPlayer(data.player);
            console.log("Player: " + data)
        });
    }, [])

    const createAuction = async () => {
        try
        {
            axios.post(`api/v1/auctions/create`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            setIsAuctionStarted(true);
            setSelectedPlayer(null)
        }
        catch (error)
        {
            console.error('Error during request:', error);
        }
    }

    const closeAuction = async () => {
        try
        {
            axios.post(`api/v1/auctions/close`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            setIsAuctionStarted(false);
        }
        catch (error)
        {
            console.error('Error during request:', error);
        }
    }



    return (
        <Sidebar>
            <h1 className='header'>Asta</h1>
            {!isAuctionStarted ? 
                <>
                    <h2 className="header">Nessuna Asta in Corso</h2>
                    {
                        isOwner ?
                        <div className="stats">
                            <div className="stat large" onClick={() => { createAuction() }}>
                                <div className="info green"><b>CREA ASTA</b></div>
                            </div>
                        </div> : ''
                    }
                </> : ''
            }
            {isAuctionStarted ?
                <>
                    <p>{selectedPlayer != null || !isOwner ? "GIOCATORE SELEZIONATO" : "SELEZIONA UN GIOCATORE"}</p>
                    {isOwner ? 
                        <>
                            <PlayerCard
                                player={selectedPlayer}
                                big
                                onClick={() => setPopupVisible(true)}
                            />
                            <div className="stats">
                            {
                                selectedPlayer != null ?
                                <div className="stat large" onClick={() => { closeAuction() }}>
                                    <div className="info green"><b>AVVIA ASTA</b></div>
                                </div> : ''
                            }
                                <div className="stat large" onClick={() => { closeAuction() }}>
                                    <div className="info red"><b>CHIUDI ASTA</b></div>
                                </div>
                            </div>
                        </>:
                        <PlayerCard
                            player={selectedPlayer}
                            big
                            onClick={() => {}}
                        />        
                    }
                </>
            : ''}
            
            <PopupDialog big trigger={popupVisible} onClose={() => setPopupVisible(false)} title="Seleziona Giocatore">
                <PlayersList onClick={(player) => { selectPlayer(player) }} />
            </PopupDialog> 
        </Sidebar>
    )
}

export default Auction;


Auction.propTypes = {
    socket: PropTypes.any
}