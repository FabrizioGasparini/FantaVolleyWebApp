import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import LeagueCard from "../../../components/leagues/LeagueCard";

import Cookies from "universal-cookie";
const cookies = new Cookies()

const League = () => {
    const { invite_code } = useParams()
    const [league, setLeague] = useState(undefined)

    const navigate = useNavigate()

    useEffect(() => {
        const getLeague = async () => {
            try {
                const token = cookies.get("token")
                axios.defaults.headers.common = { 'Authorization': `Bearer ${token}` }

                const response = await axios.get(`api/v1/leagues/read/${invite_code}`);
                setLeague(response.data.league);
            }
            catch (error)
            {
                console.error('Error during request:', error);
                navigate('/leagues')
            }
        };
        
        getLeague();

    }, [navigate, invite_code])
    
    return (
        <Sidebar>
            {league ? (
                <>
                    <LeagueCard league={league} onClick={() => { console.log("Click") }} disableSettings small />
                    <div className="stats">
                        <div className="stat">
                            <div className="info title round">Giornata</div>
                            <div className="info round">10</div>
                        </div>
                        <div className="stat">
                            <div className="info title round">Stato</div>
                            <div className="info round">Mercato Aperto</div>
                        </div>
                        <div className="stat large">
                            <div className="info round">1d:1h:25m</div>
                        </div>
                    </div>
                    <span></span>
                    <div className="stats">
                        <div className="stat large-2">
                            <div className="info green" onClick={() => navigate("roster")}>SCHIERA SQUADRA</div>
                        </div>
                        <div className="stat large-2">
                            <div className="info blue" onClick={() => navigate("auction")}>PARTECIPA ALL&apos;ASTA</div>
                        </div>
                    </div>
                </>
            ) : ''}
        </Sidebar>
    );
}

export default League;