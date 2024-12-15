// handle the error msg
const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('message').classList.remove('hidden');
};

//hide error message
const hideError = () => {
    document.getElementById('message').classList.add('hidden');
};

// send to next page
const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    document.getElementById('message').classList.add('hidden');

    if (result.redirect) {
        window.location = result.redirect;
    }
    if (result.error) {
        handleError(result.error);
    }
    if (handler) {
        handler(result);
    }
};

//delete from list
const deletePokemon = async (pokemonId, triggerReload) => {
    //call on delete
    try {
        const response = await fetch(`/pokemon/${pokemonId}`, {
            method: 'DELETE',
        });

        const result = await response.json();

        //error handling
        if (result.error) {
            handleError(result.error);
        } else {
            triggerReload();
        }
    } catch (error) {
        handleError('Error deleting');
    }
}

module.exports = {
    handleError,
    hideError,
    sendPost,
    deletePokemon,
};