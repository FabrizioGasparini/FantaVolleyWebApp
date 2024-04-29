import SelectDropdown from "../inputs/SelectDropdown"
import TextInput from "../inputs/TextInput"
import PlayerCard from "./PlayerCard"
import './PlayersList.css'
import { useCallback, useEffect, useState } from "react"
import axios from "../../api/axios"
import PropTypes from 'prop-types'

const PlayersList = (props) => {

    const [players, setPlayers] = useState(null);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [filters, setFilters] = useState({ "role": "", "team": 0, "name": "", "nation": "" });

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await axios.get('/api/v1/players/read');
                setPlayers(response.data.players);
            } catch (error) {
                console.error('Error during request:', error);
            }
        };
        
        if (players == null) fetchPlayers();
    }, []);
    
    const handleFilterChange = (e, filter) => {
        let newFilters = filters
        newFilters[filter] = e.target.value
        setFilters(newFilters)

        filterPlayers()
    };

    
    const filterPlayers = useCallback(() => {
        const filtered = players.filter(player => {
            if (filters['role'] != '') if (player.ruolo != filters['role']) return false
            if (filters['team'] != 0) if (player.squadra_id != filters['team']) return false;
            if (filters['nation'] != '') if (player.nazione != filters['nation']) return false;
            if (filters['name'].length > 2) if (!(player.nome).toLowerCase().includes(filters['name'].toLowerCase())) return false;

            return true
        });

        if (filters['team'] != 0) filtered.filter(player => player.squadra_id == filters["team"]);

        setFilteredPlayers(filtered);
    }, [filters, players])

    useEffect(() => {
        if(players != null) filterPlayers()
    }, [players])

    return (
        <>
            <p className='filters-label'>Filtri</p>
            <div className="filters">
                <div className="filter">
                    <p>Ruolo</p>
                    <SelectDropdown filters={filters} onChange={handleFilterChange}
                        filterName={"role"}
                        optionsValues={["", "Palleggiatore", "Centrale", "Schiacciatore", "Opposto", "Libero"]}
                        optionsTexts={["Tutti", "Palleggiatore", "Centrale", "Schiacciatore", "Opposto", "Libero"]}
                        />
                </div>
                <div className="filter">
                    <p>Squadra</p>
                    <SelectDropdown filters={filters} onChange={handleFilterChange}
                        filterName={"team"}
                        optionsValues={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]}
                        optionsTexts={["Qualsiasi", "Itas Trentino", "Gioiella Prisma Taranto", "Gas Sales Bluenergy Piacenza", "Cucine Lube Civitanova", "Farmitalia Catania", "Cisterna Volley", "Sir Susa Vim Perugia", "Mint Vero Volley Monza", "Valsa Group Modena", "Rana Verona", "Pallavolo Padova", "Allianz Milano"]}
                    />
                </div>
                <div className="filter">
                    <p>Nazionalità</p>
                    <SelectDropdown filters={filters} onChange={handleFilterChange}
                        filterName={"nation"}
                        optionsValues={["", "ARG", "AUS", "AUT", "BEL", "BLR", "BRA", "BUL", "CAN", "CRO", "CUB", "CZE", "ESP", "FRA", "GER", "IRI", "ITA", "JPN", "LUX", "MLI", "NED", "NOR", "POL", "POR", "RUS", "SLO", "SRB", "SWE", "TUN", "TUR", "UKR", "USA"]}
                        optionsTexts={["Qualsiasi", "ARG", "AUS", "AUT", "BEL", "BLR", "BRA", "BUL", "CAN", "CRO", "CUB", "CZE", "ESP", "FRA", "GER", "IRI", "ITA", "JPN", "LUX", "MLI", "NED", "NOR", "POL", "POR", "RUS", "SLO", "SRB", "SWE", "TUN", "TUR", "UKR", "USA"]}
                    />
                </div>
                <div className="filter">
                    <p>Nome Giocatore</p>
                    <TextInput filters={filters} onChange={handleFilterChange} filterName={"name"}/>
                </div>
            </div>

            <ul className='players-container'>
                {filteredPlayers.map((player, index) => (
                    <PlayerCard key={index} player={player} onClick={props.onClick != null ? () => props.onClick(player) : () => {}} />
                ))}
            </ul>
        </>
    )
}

PlayersList.propTypes = {
    onClick: PropTypes.func
}

export default PlayersList