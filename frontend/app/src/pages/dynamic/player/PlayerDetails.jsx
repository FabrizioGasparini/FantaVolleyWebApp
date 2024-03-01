import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import './PlayerDetails.css';
//import removeBackground from "./BackgroundRemover";

const PlayerDetails = () => {
    const { id } = useParams()
    const [player, setPlayer] = useState({})
    //const [playerImage, setPlayerImage] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                const response = await axios.get(`api/v1/players/read/${id}`);
                setPlayer(response.data.player);
            } catch (error) {
                navigate('/players')
                console.error('Error during request:', error);
            }
        };
        
        fetchPlayer();

    }, [navigate, id])

    /*useEffect(() => {
        const getPlayerImage = async () => {
            try {
                if (playerImage == '') {
                    const response = await removeBackground(player.url_foto)
                    setPlayerImage(response);
                } 
            } catch (error) {
                console.error('Error during request:', error);
            }
        };
        
        getPlayerImage();

    }, [player, playerImage])*/


    return (
        <Sidebar>
            <h1 className='header'>{player.nome} #{player.numero}</h1>
            <div className="player-image">
                <img src={player.url_giocatore || player.url_foto} alt="" />
            </div>
            <div className="stats">
                <div className="stat">
                    <div className="info title">Squadra</div>
                    <div className="info"><b>{player.squadra}</b></div>
                </div>
                <div className="stat">
                    <div className="info title">Ruolo</div>
                    <div className="info"><b>{player.ruolo}</b></div>
                </div>
                <div className="stat">
                    <div className="info title">Nazione</div>
                    <div className="info"><b>{player.nazione}</b></div>
                </div>
                <div className="stat">
                    <div className="info title">Altezza</div>
                    <div className="info"><b>{player.altezza}</b></div>
                </div>
                <div className="stat">
                    <div className="info title">Nascita</div>
                    <div className="info"><b>{player.nascita}</b></div>
                </div>
            </div>
        </Sidebar>
    );
}

export default PlayerDetails;