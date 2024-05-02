import "./Auction.css";
import Sidebar from "../../../../components/sidebar/Sidebar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import axios from "../../../../api/axios";
//import PlayerCard from '../../../../components/players/PlayerCard';
import PopupDialog from "../../../../components/popup/PopupDialog";
import PlayersList from "../../../../components/players/PlayersList";
import PlayerCard from "../../../../components/players/PlayerCard";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const cookies = new Cookies();

const sock = io("https://fantavolley.pythonanywhere.com/", {
    transports: ["websocket"],
});

const Auction = () => {
    const { invite_code } = useParams();

    const [league, setLeague] = useState({});
    const [isOwner, setIsOwner] = useState(false);
    const [isAuctionCreated, setIsAuctionCreated] = useState(false);
    const [isAuctionStarted, setIsAuctionStarted] = useState(false);
    const [auctionStatus, setAuctionStatus] = useState(0);

    const [popupVisible, setPopupVisible] = useState(false);

    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [auction, setAuction] = useState(null);

    const [roster, setRoster] = useState(null);

    const [credits, setCredits] = useState(null);
    const [bidCredits, setBidCredits] = useState(null);

    const [canBid, setCanBid] = useState(false);

    const navigate = useNavigate();

    const selectPlayer = (player) => {
        if (auction && league) {
            if (player.id in auction.selected_players) return;

            var alreadySelected = false;
            league.roster_players.forEach((rosterPlr) => {
                console.log(rosterPlr, player.id);
                if (rosterPlr == player.id) alreadySelected = true;
            });

            if (alreadySelected) return;
        }

        setSelectedPlayer(player);
        setPopupVisible(false);
    };

    const getAuction = async () => {
        try {
            const response = await axios.post(`api/v1/auctions/read/${invite_code}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setAuction(response.data.auction);

            const status = response.data.auction.status;
            setAuctionStatus(status);

            if (status == 1) {
                setSelectedPlayer(response.data.auction.current_player);
                selectPlayer(response.data.auction.current_player);
                setIsAuctionStarted(true);
            }
        } catch (error) {
            console.error("Error during request:", error);
        }
    };

    useEffect(() => {
        const getLeagues = async () => {
            const token = cookies.get("token");
            axios.defaults.headers.common = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            const response = await axios.get(`api/v1/leagues/read/${invite_code}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setLeague(response.data.league);

            if (response.data.league.owner_token == token) setIsOwner(true);
            if (response.data.league.current_auction != "") setIsAuctionCreated(true);
        };

        const getRoster = async () => {
            const token = cookies.get("token");
            axios.defaults.headers.common = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            try {
                const response = await axios.get(`api/v1/rosters/read/${invite_code}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                setRoster(response.data.roster);
                return response.data.roster;
            } catch (error) {
                console.error("Error during request:", error);
            }
        };

        const getCredits = async () => {
            try {
                const response = await axios.get(`api/v1/leagues/read/${invite_code}/credits`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                setCredits(response.data.credits);
            } catch (error) {
                if (error.response.data.error.code != 404) console.error("Error during request:", error);
            }
        };

        getRoster();
        getAuction();
        getLeagues();
        getCredits();
    }, [invite_code]);

    const createAuction = async () => {
        try {
            axios.post(
                `/api/v1/auctions/create`,
                {
                    invite_code: invite_code,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            setIsAuctionCreated(true);
            setSelectedPlayer(null);
        } catch (error) {
            console.error("Error during request:", error);
        }
    };

    const closeAuction = async () => {
        try {
            axios.post(
                `/api/v1/auctions/close`,
                {
                    invite_code: invite_code,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            setIsAuctionCreated(false);
        } catch (error) {
            console.error("Error during request:", error);
        }
    };

    const startAuction = async () => {
        try {
            const response = await axios.post(
                "/api/v1/auctions/start",
                {
                    player_id: selectedPlayer.id,
                    invite_code: invite_code,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log(response);
            if (response.status == 201) {
                setIsAuctionStarted(true);
                setAuctionStatus(1);
                getAuction();
                sock.emit("start-auction", { player: selectedPlayer });
            }
        } catch (error) {
            console.error("Error during request:", error);
        }
    };

    const endAuction = async () => {
        try {
            const response = await axios.post(
                "/api/v1/auctions/end",
                {
                    invite_code: invite_code,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            setIsAuctionStarted(false);
            setAuctionStatus(0);
            sock.emit("end-auction", response.data.auction);
        } catch (error) {
            console.error("Error during request:", error);
        }
    };

    const bidAuction = async () => {
        try {
            const response = await axios.post(
                "/api/v1/auctions/bid",
                {
                    invite_code: invite_code,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            sock.emit("bid-auction", response.data.auction);
        } catch (error) {
            console.error("Error during request:", error);
        }
    };

    useEffect(() => {
        sock.connect();
    }, []);

    useEffect(() => {
        sock.on("connect", () => {
            sock.send("Connected to socket");
        });

        sock.on("disconnect", (data) => {
            console.log(data);
        });

        sock.on("message", (data) => {
            console.log(data);
        });

        sock.on("start-auction", (data) => {
            selectPlayer(data["player"]);
            setIsAuctionStarted(true);
            setAuctionStatus(1);
        });

        sock.on("end-auction", (data) => {
            setSelectedPlayer(null);
            setIsAuctionStarted(false);
            setAuctionStatus(0);
            setAuction(data);
        });

        sock.on("bid-auction", (data) => {
            setAuction(data);
            console.log(data.current_bid.bidder_self);
            if (data.current_bid.bidder_self) setBidCredits(data.current_bid.credits);
            else setBidCredits(0);
        });

        return function cleanup() {
            sock.disconnect();
        };
    }, []);

    useEffect(() => {
        const checkCanBid = (checkPlayer) => {
            if (checkPlayer == null) return false;

            console.log(roster.available_roles[checkPlayer.ruolo.toLowerCase()]);
            if (roster.available_roles[checkPlayer.ruolo.toLowerCase()] < 1) return false;

            roster.players.forEach((player) => {
                if (player.player_id == checkPlayer.id) return false;
            });

            return true;
        };

        setCanBid(checkCanBid(selectedPlayer));
    }, [selectedPlayer]);

    return (
        <Sidebar>
            <h3
                className="header"
                style={{
                    position: "absolute",
                    right: "20px",
                    top: "20px",
                }}
            >
                Crediti ${credits - bidCredits}
            </h3>
            <h1 className="header">Asta</h1>
            {isOwner ? (
                !isAuctionCreated ? (
                    <>
                        <h2 className="header">Nessuna Asta in Corso</h2>
                        <div className="stats">
                            <div
                                className="stat large"
                                onClick={() => {
                                    createAuction();
                                }}
                            >
                                <div className="info green">
                                    <b>CREA ASTA</b>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <p>{selectedPlayer != null ? "GIOCATORE SELEZIONATO" : "SELEZIONA UN GIOCATORE"}</p>
                        <PlayerCard player={selectedPlayer} big onClick={() => (auctionStatus != 1 ? setPopupVisible(true) : {})} />
                        {auctionStatus != 1 ? (
                            <div className="stats">
                                {selectedPlayer != null ? (
                                    <div
                                        className="stat large"
                                        onClick={() => {
                                            startAuction();
                                        }}
                                    >
                                        <div className="info green">
                                            <b>AVVIA ASTA</b>
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}
                                <div
                                    className="stat large"
                                    onClick={() => {
                                        closeAuction();
                                    }}
                                >
                                    <div className="info red">
                                        <b>CHIUDI ASTA</b>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="stats">
                                <div
                                    className="stat large"
                                    onClick={() => {
                                        endAuction();
                                    }}
                                >
                                    <div className="info red">
                                        <b>TERMINA ASTA</b>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )
            ) : !isAuctionStarted ? (
                <h2 className="header">Nessuna Asta in Corso</h2>
            ) : (
                <>
                    <p>GIOCATORE SELEZIONATO</p>
                    <PlayerCard player={selectedPlayer} big onClick={() => {}} />
                </>
            )}
            {isAuctionStarted && auction ? (
                <div className="stats">
                    <div className="stat">
                        <div className="info title blue">Offerta</div>
                        <div className="info">
                            {auction.current_bid.bid} ({auction.current_bid.bidder_username != "" ? auction.current_bid.bidder_username : "Nessuno"})
                        </div>
                    </div>
                    <div className="stat large-2">
                        <div
                            className={`info title ${canBid ? "green" : ""}`}
                            onClick={
                                canBid
                                    ? () => {
                                          bidAuction();
                                      }
                                    : () => {}
                            }
                        >
                            {canBid ? "OFFRI(+5)" : "IMPOSSIBILE OFFRIRE"}
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}
            <div className="stats">
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

            <PopupDialog big trigger={popupVisible} onClose={() => setPopupVisible(false)} title="Seleziona Giocatore">
                <PlayersList
                    onClick={(player) => {
                        selectPlayer(player);
                    }}
                />
            </PopupDialog>
        </Sidebar>
    );
};

export default Auction;
