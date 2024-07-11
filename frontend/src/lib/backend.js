const baseUrl = "http://localhost:3000";

export async function isValidToken() {
    let url = `${baseUrl}/authToken`;

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
    let url = `${baseUrl}/search`;
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

// ----- Playlists -----

export async function getPubPlaylist() {
    let url = `${baseUrl}/getAllPublicPlaylists`;
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
    let url = `${baseUrl}/getPlaylist?id=${query}`;

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

export async function myPlaylists() {
    let url = `${baseUrl}/myPlaylists`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        },
    });

    return await res.json();
}

export async function createPlaylist(name, isPublic, tracks, tags, description, thumbnail) {
    let url = `${baseUrl}/createPlaylist`;

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
            "description": description,
            "thumbnail": thumbnail
        })
    });
    if (res.ok) {
        return await res.json();
    } else {
        throw new Error("Errore nella creazione della playlist");
    }
}

export async function deletePlaylist(playlistId) {
    let url = `${baseUrl}/deletePlaylist`;

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
    let url = `${baseUrl}/editPlaylist`;
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
    let url = `${baseUrl}/getMySavedPlaylists`;
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
    let url = `${baseUrl}/savePlaylist`;
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
    let url = `${baseUrl}/removeSavedPlaylist`;
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

export async function sharePlaylist(playlistId, communityId) {
    let url = `${baseUrl}/sharePlaylist`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify({
            "communityId": communityId,
            "playlistId": playlistId
        })
    });

    return await res.json();
}

// ----- Tracks -----

/**
 * @param {ObjectId} query
 */
export async function getTrackInfo(query) {
    let url = `${baseUrl}/getTrack`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: query})
    });

    return await res.json();
}

export async function addTrackToPlaylist(trackId, playlistId) {
    let url = `${baseUrl}/addTrackToPlaylist`;

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
    let url = `${baseUrl}/removeTrackFromPlaylist`;

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

// ----- Users -----

/**
 * @param userId
 * @returns {Promise<any|boolean>}
 */
export async function getUser(userId) {
    let url = `${baseUrl}/getUser`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"_id": userId})
    });
    return await res.json();
}

export async function deleteUser() {
    let url = `${baseUrl}/deleteUser`;

    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        },
    });
}

export async function editUser(username, email, artists, genres) {
    let url = `${baseUrl}/editUser`;

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
    let url = `${baseUrl}/getMyInfo`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        }
    });

    return await res.json();
}

export async function changePassword(newPassword) {
    let url = `${baseUrl}/changePassword`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify({
            "password": newPassword,
        })
    });

    return await res.json();
}

// ----- Artists -----

/**
 * @param {string[]} ids
 * @returns {Promise<any>}
 */
export async function getArtists(ids) {
    let url = `${baseUrl}/getArtists`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"ids": ids})
    });

    return await res.json();
}

/**
 * @param {string} id
 * @returns {Promise<any>}
 */
export async function getArtist(id) {
    let url = `${baseUrl}/getArtist`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"id": id})
    });

    return await res.json();
}

// ----- Communities -----

export async function getMyCommunities() {
    let url = `${baseUrl}/getMyCommunities`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        }
    });

    return await res.json();
}

export async function getCommunity(communityId) {
    let url = `${baseUrl}/getCommunity`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify({
            "_id": communityId
        })
    });

    return await res.json();
}

export async function login(user) {
    let url = `${baseUrl}/login`;
    return await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
}

export async function register(user) {
    let url = `${baseUrl}/register`;

    return await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
}

export async function searchArtist(artistName) {
    let url = `${baseUrl}/searchArtist`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({artistname: artistName}),
    });
    return res.json();
}

export async function getGenres() {
    let url = `${baseUrl}/getGenres`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return res.json();
}

export async function searchUser(keywordUsr) {
    let url = `${baseUrl}/searchUser`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify({username: keywordUsr}),
    });
    return res.json();
}

export async function createCommunity(listaUtenti, communityName) {
    let url = `${baseUrl}/createCommunity`;
    return await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify({
            users: listaUtenti,
            communityName: communityName
        })
    });
}

export async function editCommunity(communityId, listaUtenti, communityName) {
    let url = `${baseUrl}/editCommunity`;
    return await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify({
            communityId: communityId,
            users: listaUtenti,
            communityName: communityName
        })
    });
}