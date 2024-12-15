// imports
const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

//for the search page
const SearchPage = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    // for popup window
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    //for changes
    const [inputName, setName] = useState('');
    const [inputHeight, setHeight] = useState('');
    const [inputWeight, setWeight] = useState('');

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
            //if none found fetch them all
            const allResponse = await fetch('/all-pokemon');
            const allData = await allResponse.json();
            setPokemonList(allData);
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

    //add button
    const handleAddButton = (pokemon) => {
        //current selected pokemon
        setSelectedPokemon(pokemon)
        //set defaults
        setHeight(pokemon.height);
        setWeight(pokemon.weight);
        //open popup
        setIsModalOpen(true);
    };

    //submit button
    const handleAddToList = async () => {
        if (!inputName.trim()) {
            helper.handleError('Nickname needed!');
            return;
        }

        const pokemonData = {
            num: selectedPokemon.num,
            name: selectedPokemon.name,
            img: selectedPokemon.img,
            type: selectedPokemon.type,
            height: inputHeight,
            weight: inputWeight,
            nickname: inputName,
        };

        try {
            const response = await fetch('/add-pokemon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pokemonData),
            });

            const result = await response.json();

            if (response.ok) {
                setIsModalOpen(false);
                setName('');
                setHeight('');
                setWeight('');
            } else {
                helper.handleError(result.error || 'Error adding Pokémon');
            }
        } catch (error) {
            helper.handleError(`Problem adding ${selectedPokemon.name} to your list.`);
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
                <button onClick={() => handleAddButton(pokemon)}>
                    Add
                </button>
            </div>
        ));
    };

    //search page and popoup
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

            {isModalOpen && (
                <div className="modal open">
                    <div className="modal-content">
                        <h3>Enter a nickname for {selectedPokemon?.name}</h3>
                        <input
                            type="text"
                            value={inputName}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nickname"
                        />
                        <input
                            type="text"
                            value={inputHeight}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder={`${selectedPokemon?.height}`}
                        />
                        <input
                            type="text"
                            value={inputWeight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder={`${selectedPokemon?.weight}`}
                        />
                        <button onClick={handleAddToList}>Confirm</button>
                        <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};


//initialize
const init = () => {
    const root = createRoot(document.getElementById('app'));

    root.render(<SearchPage />);
};

window.onload = init;
