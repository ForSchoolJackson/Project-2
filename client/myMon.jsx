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
            <div className="noPokemonList">
                <h3 className="emptyPokemon">No Pokemon Yet!</h3>
                <button onClick={goSearch} className="btnFind">
                    Find Some
                </button>
            </div>
        );
    };

    const pokemonNodes = pokemon.map(mon => {
        //for type array
        const types = Array.isArray(mon.type) ? mon.type.join(', ') : 'Unknown Type';
        return (
            <div key={mon.id} className="pokemon">
                <div class="image">
                    <img src={mon.img} alt={mon.name} className="pokemonImg" />
                </div>
                <div class="text">
                    <h2 className="pokemonName">{mon.name}</h2>
                    <p className="pokemonType">{types}</p>
                    <p className="pokemonHeight">Height: {mon.height}</p>
                    <p className="pokemonWeight">Weight: {mon.weight}</p>
                    <button
                        className="deletepokemonSubmit"
                        onClick={() => helper.deletePokemon(mon._id, props.triggerReload)}>
                        Delete
                    </button>
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

const ListPage = () => {
    const [reloadPokemon, setReloadPokemon] = useState(false);

    return (
        <div id="pokemon">
            <PokemonList pokemon={[]} reloadPokemon={reloadPokemon} triggerReload={() => setReloadPokemon(!reloadPokemon)} />
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<ListPage />)
};

window.onload = init;