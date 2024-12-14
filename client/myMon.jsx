// imports
const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

// pokemon list componant
const PokemonList = (props) => {
    const [pokemon, setPokemon] = useState(props.pokemon);

    useEffect(() => {
        const loadPokemonFromServer = async () => {
            const response = await fetch('/getPokemon');
            const data = await response.json();
            setPokemon(data.pokemon);
        };
        loadPokemonFromServer();
    }, [props.reloadPokemon]);

    // goto search page
    const goSearch = () => {
        window.location.replace('/search');
    }

    // if no pokemon yet
    if (pokemon.length === 0) {
        return (
            <div className="pokemonList">
                <h3 className="emptyPokemon">No Pokemon Yet!</h3>
                <button onClick={goSearch} className="btnFind">
                    Find Some
                </button>
            </div>
        );
    };

    const pokemonNodes = pokemon.map(mon => {
        return (
            <div key={mon.id} className="pokemon">
                <button
                    className="deletepokemonSubmit"
                    onClick={() => helper.deletePokemon(mon._id, props.triggerReload)}>
                    Delete
                </button>
                <div className="info">
                    <h3 className="pokemonName">Name: {mon.name}</h3>
                </div>
            </div>
        );
    });

    return (
        <div className="pokemonList">
            {pokemonNodes}
        </div>
    );
};

const ProfilePage = () => {
    const [reloadPokemon, setReloadPokemon] = useState(false);

    return (
        <div id="pokemon">
            <PokemonList pokemon={[]} reloadPokemon={reloadPokemon} triggerReload={() => setReloadPokemon(!reloadPokemon)} />
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<ProfilePage />)
};

window.onload = init;