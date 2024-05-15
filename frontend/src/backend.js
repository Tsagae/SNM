import Cookies from 'js-cookie';

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
            Authorization: 'Bearer ' + Cookies.get('authToken')
        }
    });

    return await res.json();
}

export async function getPubPlaylist() {
    let url = `http://localhost:3000/getAllPublicPlaylists`;
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return await res.json();
}