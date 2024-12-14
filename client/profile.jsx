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
    const [profilePicture, setProfilePicture] = useState(null);

    useEffect(() => {
        const loadUserData = async () => {
            const response = await fetch('/getProfile');
            const data = await response.json();

            setUsername(data.user.username);
            setId(data.user._id);
            setPokemonNum(data.pokemonNum);
            setProfilePicture(data.user.profilePicture);

        };
        loadUserData();
    }, []);

    // send to other page for changes
    const changePassword = () => {
        // https://developer.mozilla.org/en-US/docs/Web/API/Location/replace
        window.location.replace('/passChange');
    }

    //return different response for number of pokemon owned
    let numResponse;
    if (pokemonNum > 0) {
        numResponse = `Owns ${pokemonNum} pokemon!`
    } else {
        numResponse = 'No pokemon in collection!';
    }

    // return HTML
    return (
        <div className="profile">
            <div className="profilePictureContainer">
                <img
                    src={profilePicture || '/assets/img/pikachu.png'}
                    alt="Profile Picture"
                    className="profilePicture"
                />
            </div>
            <h2>{username}</h2>
            <h3>{id}</h3>
            <p>{numResponse}</p>
            <button onClick={changePassword} className="btnChange">
                Change Password
            </button>
        </div>
    );

};

const ProfilePage = () => {
    const [reloadPokemon, setReloadPokemon] = useState(false);

    return (
        <div id="profile">
            <Profile pokemon={[]} reloadPokemon={reloadPokemon} triggerReload={() => setReloadPokemon(!reloadPokemon)} />
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<ProfilePage />)
};

window.onload = init;