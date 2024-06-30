export async function isValidToken() {
    let url = `http://localhost:3000/authToken`;

    if(localStorage.getItem('authToken') === null){
        return false;
    }
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        }
    });

    return await res.json();
}

/**
 * @param {string} query
 * @param {string[]} filters
 */
export async function search(query, filters) {
    let url = `http://localhost:3000/search?q=${query}`;
    for (let val of filters) {
        url += `&filters=${val}`;
    }
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        }
    });

    return await res.json();
}

export async function getPubPlaylist() {
    let url = `http://localhost:3000/getAllPublicPlaylists`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return await res.json();
}

/**
 * @param {ObjectId} query
 */
export async function getPlaylistInfo(query) {
    let url = `http://localhost:3000/getPlaylist?id=${query}`;

    if(localStorage.getItem('authToken') === null){
        return false;
    }

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        },
        body : JSON.stringify({id : query})
    });

    return await res.json();
}

/**
 * @param {ObjectId} query
 */
export async function getTrackInfo(query) {
    let url = `http://localhost:3000/getTrack`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({id : query})
    });

    return await res.json();
}