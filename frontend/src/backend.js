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