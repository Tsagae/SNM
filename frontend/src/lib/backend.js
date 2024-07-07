export async function isValidToken() {
    let url = `http://localhost:3000/authToken`;

    if (localStorage.getItem('authToken') === null) {
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
    let url = `http://localhost:3000/search`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify({"query": query, "filters": filters})
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

    if (localStorage.getItem('authToken') === null) {
        return {error: "Esegui il login per vedere le playlist"};
    }

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify({id: query})
    });
    if (res.ok) {
        return await res.json();
    } else {
        return {error: "Non puoi vedere questa playlist: potrebbe essere privata o inesistente"};
    }
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
        body: JSON.stringify({id: query})
    });

    return await res.json();
}

/**
 *
 * @param userId
 * @returns {Promise<any|boolean>}
 */
export async function getUser(userId) {
    let url = `http://localhost:3000/getUser`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"_id": userId})
    });
    return await res.json();
}

/**
 *
 * @param {string[]} ids
 * @returns {Promise<any>}
 */
export async function getArtists(ids) {
    let url = `http://localhost:3000/getArtists`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"ids": ids})
    });

    return await res.json();
}


export async function myPlaylists() {
    let url = `http://localhost:3000/myPlaylists`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        },
    });

    return await res.json();
}


export async function addTrackToPlaylist(trackId, playlistId) {
    let url = `http://localhost:3000/addTrackToPlaylist`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify({
            "playlist": playlistId,
            "track": trackId
        })
    });

    return await res.json();
}

export async function removeTrackFromPlaylist(trackId, playlistId) {
    let url = `http://localhost:3000/removeTrackFromPlaylist`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify({
            "playlist": playlistId,
            "track": trackId
        })
    });

    return await res.json();
}

export async function createPlaylist(name, isPublic, tracks, tags, description) {
    let url = `http://localhost:3000/createPlaylist`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify({
            "name": name,
            "isPublic": isPublic,
            "tracks": tracks,
            "tags": tags,
            "description": description
        })
    });
    if (res.ok) {
        return await res.json();
    } else {
        throw new Error("Errore nella creazione della playlist");
    }
}

export async function deleteUser() {
    let url = `http://localhost:3000/deleteUser`;

    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        },
    });
}


export async function editUser(username, email, artists, genres) {
    let url = `http://localhost:3000/editUser`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify({
            "username": username,
            "email": email,
            "artists": artists,
            "genres": genres,
        })
    });

    return await res.json();
}

export async function getMyInfo() {
    let url = `http://localhost:3000/getMyInfo`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        }
    });

    return await res.json();
}

export async function deletePlaylist(playlistId) {
    let url = `http://localhost:3000/deletePlaylist`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify({
            "id": playlistId
        })
    });

    return await res.json();
}


export async function editPlaylist(id, name, isPublic, tracks, tags, description) {
    let url = `http://localhost:3000/editPlaylist`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify({
            "id": id,
            "name": name,
            "isPublic": isPublic,
            "tracks": tracks,
            "tags": tags,
            "description": description,
        })
    });

    return await res.json();
}

export async function getMySavedPlaylists() {
    let url = `http://localhost:3000/getMySavedPlaylists`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        }
    });

    return await res.json();
}

export async function savePlaylist(playlistId) {
    let url = `http://localhost:3000/savePlaylist`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify({_id: playlistId})
    });

    return await res.json();
}

export async function removeSavedPlaylist(playlistId) {
    let url = `http://localhost:3000/removeSavedPlaylist`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify({_id: playlistId})
    });

    return await res.json();
}
