// imports
const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const SearchPage = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Fetch all Pokémon data when component mounts
        const fetchAllPokemon = async () => {
            try {
                const response = await fetch('/all-pokemon');
                const data = await response.json();
                setPokemonList(data);
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };

        fetchAllPokemon();
    }, []);

    //search by name
    const handleSearchByName = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            helper.handleError('Please enter a Pokemon name!');
            return;
        }

        try {
            const response = await fetch(`/pokemon?name=${searchQuery}`);
            const data = await response.json();

            if (data.name) {
                setPokemonList([data]);
            } else {
                //if none found fetch them all
                const allResponse = await fetch('/all-pokemon');
                const allData = await allResponse.json();
                setPokemonList(allData);
                helper.handleError(`No Pokemon found with the name: ${searchQuery}`);
            }
        } catch (error) {
            helper.handleError(`Problem finding pokemon`);
        }
    };

    //pokemon list
    const renderPokemonList = () => {
        if (pokemonList.length === 0) {
            return <p>No Pokemon found</p>;
        }
        return pokemonList.map((pokemon) => (
            <div key={pokemon.id} className="pokemon-card">
                <img src={pokemon.img} alt={pokemon.name} className="pokemon-img" />
                <h3>{pokemon.name}</h3>
                <p>Type: {pokemon.type.join(', ')}</p>
                <p>Height: {pokemon.height}</p>
                <p>Weight: {pokemon.weight}</p>
                <button onClick={() => handleAddToList(pokemon)}>
                    Add
                </button>
            </div>
        ));
    };

    return (
        <div className="search-container">
            <h2>Search Pokemon</h2>
            <form onSubmit={handleSearchByName}>
                <input
                    type="text"
                    placeholder=""
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
            <div id="message" class='hidden'>
                <h3><span id="errorMessage"></span></h3>
            </div>
            <div className="pokemon-list">{renderPokemonList()}</div>
        </div>
    );
};

//add to list
const handleAddToList = (pokemon) => {
    
    setUserPokemonList([...userPokemonList, pokemon]);
    helper.handleError(`${pokemon.name} added to your list!`);
};

//initialize
const init = () => {
    const root = createRoot(document.getElementById('app'));

    root.render(<SearchPage />);
};

window.onload = init;
