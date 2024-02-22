import { useState, useEffect, useCallback } from 'react';
import axios from "../api/axios";
import PlayerCard from "../components/players/PlayerCard";

const Players = () => {
    const [players, setPlayers] = useState([]);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [filters, setFilters] = useState({ "role": "", "team": 0, "name": "" });

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await axios.get('/api/v1/players/read');
                setPlayers(response.data.players);
            } catch (error) {
                console.error('Error during request:', error);
            }
        };
        
        fetchPlayers();
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
            if (filters['name'].length > 2) if (!(player.nome).toLowerCase().includes(filters['name'].toLowerCase())) return false;

            return true
        });

        if (filters['team'] != 0) filtered.filter(player => player.squadra_id == filters["team"]);

        setFilteredPlayers(filtered);
    }, [filters, players])
    
    useEffect(() => {
        filterPlayers()
    }, [filterPlayers])

    return (
        <>
            <div className="filters">
                <select value={filters["role"]} onChange={e => handleFilterChange(e, "role")}>
                    <option value="">Tutti</option>
                    <option value="Palleggiatore">Palleggiatore</option>
                    <option value="Centrale">Centrale</option>
                    <option value="Schiacciatore">Schiacciatore</option>
                    <option value="Opposto">Opposto</option>
                    <option value="Libero">Libero</option>
                </select>
                <select value={filters["team"]} onChange={e => handleFilterChange(e, "team")}>
                    <option value="0">Tutti</option>
                    <option value="1">Itas Trentino</option>
                    <option value="2">Gioiella Prisma Taranto</option>
                    <option value="3">Gas Sales Bluenergy Piacenza</option>
                    <option value="4">Cucine Lube Civitanova</option>
                    <option value="5">Farmitalia Catania</option>
                    <option value="6">Cisterna Volley</option>
                    <option value="7">Sir Susa Vim Perugia</option>
                    <option value="8">Mint Vero Volley Monza</option>
                    <option value="9">Valsa Group Modena</option>
                    <option value="10">Rana Verona</option>
                    <option value="11">Pallavolo Padova</option>
                    <option value="12">Allianz Milano</option>
                </select>
                <input type="text" name="nome" id="nome" value={filters['name']} onChange={e => handleFilterChange(e, 'name')} />
            </div>

            <ul style={{width: '100vw', height: '100vh', display: 'flex', maxWidth: '100vw', flexWrap: 'wrap', overflow: 'scroll', justifyContent:'center'}}>
                
                {filteredPlayers.map((player, index) => (
                    <PlayerCard key={index} player={player} />
                ))}
            </ul>
        </>
    )
}

export default Players;