import "./Roster.css";
import Sidebar from "../../../../components/sidebar/Sidebar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import axios from "../../../../api/axios";
import { useNavigate } from "react-router-dom";
import PlayerCard from "../../../../components/players/PlayerCard";
import CourtPosition from "../../../../components/roster/CourtPosition";

const cookies = new Cookies();

const Roster = () => {
    const { invite_code } = useParams();
    const [roster, setRoster] = useState(null);
    const [unusedPlayers, setUnusedPlayers] = useState(null);
    const [players, setPlayers] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (roster == null) {
            getRoster();
        }
    }, []);

    const getRoster = async () => {
        try {
            const token = cookies.get("token");
            axios.defaults.headers.common = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.post(
                "/api/v1/rosters/read",
                { invite_code: invite_code },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            setRoster(response.data.roster);
        } catch (error) {
            console.error("Error during request:", error);
            navigate(`/leagues/${invite_code}`);
        }
    };

    const fetchUnusedPlayers = async () => {
        try {
            const response = await axios.get("/api/v1/players/read");

            const output = [];
            response.data.players.forEach((player) => {
                roster.players.forEach((rosterPlayer) => {
                    if (player.id == rosterPlayer.player_id && rosterPlayer.court_position == 0) {
                        output.push(player);
                    }
                });
            });

            setUnusedPlayers(output);
            setPlayers(response.data.players);
        } catch (error) {
            console.error("Error during request:", error);
        }
    };

    useEffect(() => {
        if (roster != null && unusedPlayers == null) {
            fetchUnusedPlayers();
        }
    }, [roster, unusedPlayers]);

    const getPlayer = (position) => {
        const roster_player = roster.players.find((player) => player.court_position == position);

        if (roster_player != undefined) {
            const player = players.find((player) => player.id == roster_player.player_id);

            return player;
        }

        return null;
    };

    const onDropCard = () => {
        getRoster();
        fetchUnusedPlayers();
    };

    return (
        <Sidebar scroll>
            <h1 className="header">Formazione</h1>
            {roster != null && unusedPlayers != null ? (
                <div className="court">
                    <h3 className="header">Titolari</h3>

                    <ul className="titolari">
                        <div className="libero">
                            <div className="empty-player"></div>
                            <CourtPosition role="Libero" court_position={7} invite_code={invite_code} player={getPlayer(7)} onDrop={() => onDropCard()} className={getPlayer(7) != null ? "court-position player" : "court-position"}>
                                {getPlayer(7) != null ? <PlayerCard player={getPlayer(7)} small draggable court_position={7} /> : ""}
                            </CourtPosition>
                        </div>
                        <div className="giocatori">
                            {/* POSTO 4 */}
                            <CourtPosition role="Opposto" court_position={4} invite_code={invite_code} player={getPlayer(4)} onDrop={() => onDropCard()} className={getPlayer(4) != null ? "court-position player" : "court-position"}>
                                {getPlayer(4) != null ? <PlayerCard player={getPlayer(4)} small draggable court_position={4} /> : ""}
                            </CourtPosition>
                            {/* POSTO 5 */}
                            <CourtPosition role="Schiacciatore" court_position={5} invite_code={invite_code} player={getPlayer(5)} onDrop={() => onDropCard()} className={getPlayer(5) != null ? "court-position player" : "court-position"}>
                                {getPlayer(5) != null ? <PlayerCard player={getPlayer(5)} small draggable court_position={5} /> : ""}
                            </CourtPosition>
                            {/* POSTO 3 */}
                            <CourtPosition role="Centrale" court_position={3} invite_code={invite_code} player={getPlayer(3)} onDrop={() => onDropCard()} className={getPlayer(3) != null ? "court-position player" : "court-position"}>
                                {getPlayer(3) != null ? <PlayerCard player={getPlayer(3)} small draggable court_position={3} /> : ""}
                            </CourtPosition>
                            {/* POSTO 6 */}
                            <CourtPosition role="Centrale" court_position={6} invite_code={invite_code} player={getPlayer(6)} onDrop={() => onDropCard()} className={getPlayer(6) != null ? "court-position player" : "court-position"}>
                                {getPlayer(6) != null ? <PlayerCard player={getPlayer(6)} small draggable court_position={6} /> : ""}
                            </CourtPosition>
                            {/* POSTO 2 */}
                            <CourtPosition role="Schiacciatore" court_position={2} invite_code={invite_code} player={getPlayer(2)} onDrop={() => onDropCard()} className={getPlayer(2) != null ? "court-position player" : "court-position"}>
                                {getPlayer(2) != null ? <PlayerCard player={getPlayer(2)} small draggable court_position={2} /> : ""}
                            </CourtPosition>

                            {/* POSTO 1 */}
                            <CourtPosition role="Palleggiatore" court_position={1} invite_code={invite_code} player={getPlayer(1)} onDrop={() => onDropCard()} className={getPlayer(1) != null ? "court-position player" : "court-position"}>
                                {getPlayer(1) != null ? <PlayerCard player={getPlayer(1)} small draggable court_position={1} /> : ""}
                            </CourtPosition>
                        </div>
                        <div className="libero">
                            <div className="empty-player"></div>
                            <div className="empty-player"></div>
                        </div>
                    </ul>
                    <h3 className="header">Panchina</h3>
                    <div className="panchina">
                        <CourtPosition role="Opposto" court_position={8} invite_code={invite_code} player={getPlayer(8)} onDrop={() => onDropCard()} className={getPlayer(8) != null ? "court-position player" : "court-position"}>
                            {getPlayer(8) != null ? <PlayerCard player={getPlayer(8)} small draggable court_position={8} /> : ""}
                        </CourtPosition>
                        <CourtPosition role="Palleggiatore" court_position={9} invite_code={invite_code} player={getPlayer(9)} onDrop={() => onDropCard()} className={getPlayer(9) != null ? "court-position player" : "court-position"}>
                            {getPlayer(9) != null ? <PlayerCard player={getPlayer(9)} small draggable court_position={9} /> : ""}
                        </CourtPosition>
                        <CourtPosition role="Schiacciatore" court_position={10} invite_code={invite_code} player={getPlayer(10)} onDrop={() => onDropCard()} className={getPlayer(10) != null ? "court-position player" : "court-position"}>
                            {getPlayer(10) != null ? <PlayerCard player={getPlayer(10)} small draggable court_position={10} /> : ""}
                        </CourtPosition>
                        <CourtPosition role="Schiacciatore" court_position={11} invite_code={invite_code} player={getPlayer(11)} onDrop={() => onDropCard()} className={getPlayer(11) != null ? "court-position player" : "court-position"}>
                            {getPlayer(11) != null ? <PlayerCard player={getPlayer(11)} small draggable court_position={11} /> : ""}
                        </CourtPosition>
                        <CourtPosition role="Centrale" court_position={12} invite_code={invite_code} player={getPlayer(12)} onDrop={() => onDropCard()} className={getPlayer(12) != null ? "court-position player" : "court-position"}>
                            {getPlayer(12) != null ? <PlayerCard player={getPlayer(12)} small draggable court_position={12} /> : ""}
                        </CourtPosition>
                        <CourtPosition role="Centrale" court_position={13} invite_code={invite_code} player={getPlayer(13)} onDrop={() => onDropCard()} className={getPlayer(13) != null ? "court-position player" : "court-position"}>
                            {getPlayer(13) != null ? <PlayerCard player={getPlayer(13)} small draggable court_position={13} /> : ""}
                        </CourtPosition>
                        <CourtPosition role="Libero" court_position={14} invite_code={invite_code} player={getPlayer(14)} onDrop={() => onDropCard()} className={getPlayer(14) != null ? "court-position player" : "court-position"}>
                            {getPlayer(14) != null ? <PlayerCard player={getPlayer(14)} small draggable court_position={14} /> : ""}
                        </CourtPosition>
                    </div>
                </div>
            ) : (
                ""
            )}
            {unusedPlayers != null && unusedPlayers.length > 0 ? (
                <div className="players-list">
                    <h3 className="header">Giocatori Disponibili</h3>
                    <ul style={{ overflow: "hidden" }}>
                        {unusedPlayers.map((player, index) => (
                            <CourtPosition key={index} role="Libero" court_position={0} invite_code={invite_code} player={player} onDrop={() => onDropCard()} className="court-position player">
                                <PlayerCard player={player} small draggable court_position={0} />
                            </CourtPosition>
                        ))}
                    </ul>
                </div>
            ) : (
                ""
            )}
            <div className="stats" style={{ marginBottom: "20px" }}>
                <div
                    className="stat"
                    onClick={() => {
                        navigate(`/leagues/${invite_code}`);
                    }}
                >
                    <div className="info red">
                        <b>INDIETRO</b>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};

export default Roster;
