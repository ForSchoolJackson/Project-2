// imports
const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

// profile componant
const Profile = () => {
    const [username, setUsername] = useState(null);
    const [id, setId] = useState(null);
    const [pokemonNum, setPokemonNum] = useState(null);

    useEffect(() => {
        const loadUserData = async () => {
            const response = await fetch('/getProfile');
            const data = await response.json();

            setUsername(data.user.username);
            setId(data.user._id);
            setPokemonNum(data.pokemonNum);

        };
        loadUserData();
    }, []);

    // send to other page for changes
    const changePassword = () => {
        // https://developer.mozilla.org/en-US/docs/Web/API/Location/replace
        window.location.replace('/passChange');
    }

    const changeProfile = () => {
        window.location.replace('/picChange');
    }

    //return different response for number of pokemon owned
    let numResponse;
    if(pokemonNum > 0){
        numResponse = `You own ${pokemonNum} pokemon!`
    }else{
        numResponse = `So lonely...`
    }

    // return HTML
    return(
        <div className="profile">
            <h2>{username}</h2>
            <h3>{id}</h3>
            <p>{numResponse}</p>
            <button onClick={changeProfile} className="btnPicChange">
                Change Picture
            </button>
            <button onClick={changePassword} className="btnChange">
                Change Password
            </button>
        </div>
    );

};

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
                    onClick={() => helper.deletepokemon(mon._id, props.triggerReload)}>
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

const App = () => {
    const [reloadPokemon, setReloadPokemon] = useState(false);

    return (
        <div id="all">
            <div id="profile">
                <Profile pokemon={[]} reloadPokemon={reloadPokemon} triggerReload={() => setReloadPokemon(!reloadPokemon)} />
            </div>
            <div id="pokemon">
                <PokemonList pokemon={[]} reloadPokemon={reloadPokemon} triggerReload={() => setReloadPokemon(!reloadPokemon)} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />)
};

window.onload = init;