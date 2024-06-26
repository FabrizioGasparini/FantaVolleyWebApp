import Sidebar from "../components/sidebar/Sidebar";
import LeagueCard from "../components/leagues/LeagueCard";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import PopupDialog from "../components/popup/PopupDialog";

import "./css/Leagues.css";
import { useNavigate } from "react-router-dom";

import Cookies from "universal-cookie";
const cookies = new Cookies();

const Leagues = () => {
    const [leagues, setLeagues] = useState([]);
    const [popupVisible, setPopupVisible] = useState(false);

    const [createPopupVisible, setCreatePopupVisible] = useState(false);
    const [leagueName, setLeagueName] = useState("");
    const [error, setError] = useState("");

    const [inviteCode, setInviteCode] = useState("");
    const [joinPopupVisible, setJoinPopupVisible] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const getLeagues = async () => {
            const token = cookies.get("token");
            axios.defaults.headers.common = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.post("api/v1/leagues/read", {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setLeagues(response.data.leagues);
        };

        getLeagues();
    }, []);

    const createLeague = async () => {
        try {
            const response = await axios.post(
                "/api/v1/leagues/create",
                { name: leagueName },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            setCreatePopupVisible(false);
            navigate(`${response.data.league.invite_code}`);
            setError("");
        } catch (error) {
            console.error("Error during request:", error);
            setError(error.response.data.error.message);
        }
    };

    const joinLeague = async () => {
        try {
            const response = await axios.post(
                "/api/v1/leagues/join",
                { invite_code: inviteCode },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            setJoinPopupVisible(false);
            navigate(`${response.data.league.invite_code}`);
            setError("");
        } catch (error) {
            console.error("Error during request:", error);
            setError(error.response.data.error.message);
        }
    };

    const showJoinPopup = () => {
        setPopupVisible(false);
        setJoinPopupVisible(true);
    };

    const showCreatePopup = () => {
        setPopupVisible(false);
        setCreatePopupVisible(true);
    };

    return (
        <Sidebar>
            <h1 className="header">Leghe</h1>
            <ul className="leagues">
                <LeagueCard
                    league={null}
                    onClick={() => {
                        setPopupVisible(true);
                    }}
                />
                {leagues.map((league, index) => (
                    <LeagueCard
                        league={league}
                        key={index}
                        onClick={() => {
                            navigate(`${league.invite_code}`);
                        }}
                    />
                ))}
            </ul>
            <PopupDialog
                trigger={popupVisible}
                onClose={() => setPopupVisible(false)}
                title="Crea o Unisciti"
            >
                <div className="stats">
                    <div className="stat large">
                        <div
                            className="info blue"
                            onClick={() => showJoinPopup()}
                        >
                            UNISCITI AD UNA LEGA
                        </div>
                    </div>
                    <div className="stat large">
                        <div
                            className="info green"
                            onClick={() => showCreatePopup()}
                        >
                            CREA NUOVA LEGA
                        </div>
                    </div>
                </div>
            </PopupDialog>
            <PopupDialog
                trigger={createPopupVisible}
                onClose={() => setCreatePopupVisible(false)}
                title="Nuova Lega"
            >
                <div className="stats">
                    <div className="stat">
                        <div className="info title">Nome</div>
                        <input
                            type="text"
                            className="text-input info"
                            style={{ fontWeight: "bold" }}
                            value={leagueName}
                            onChange={(e) => setLeagueName(e.target.value)}
                        />
                    </div>
                    <p className="error-message" style={{ margin: "0px" }}>
                        {error}
                    </p>
                    <div className="stat large">
                        <div
                            className="info green"
                            onClick={() => createLeague()}
                        >
                            CREA
                        </div>
                    </div>
                </div>
            </PopupDialog>
            <PopupDialog
                trigger={joinPopupVisible}
                onClose={() => setJoinPopupVisible(false)}
                title="Unisciti ad una Lega"
            >
                <div className="stats">
                    <div className="stat">
                        <div className="info title">Codice</div>
                        <input
                            type="text"
                            className="text-input info"
                            style={{ fontWeight: "bold" }}
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                        />
                    </div>
                    <p className="error-message" style={{ margin: "0px" }}>
                        {error}
                    </p>
                    <div className="stat large">
                        <div className="info blue" onClick={() => joinLeague()}>
                            UNISCITI
                        </div>
                    </div>
                </div>
            </PopupDialog>
        </Sidebar>
    );
};

export default Leagues;
