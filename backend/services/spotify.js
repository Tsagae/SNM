const config = require('config');


const client_id = config.get('spotify.clientId')
const client_secret = config.get('spotify.clientSecret')
var url = "https://accounts.spotify.com/api/token"

let apiToken;

/**
 * Refreshes the current api token
 */
function refreshApiToken() {
    apiToken = "BQCiwWZl3L3tTBmd7SkkWULS0J8Un3qnfMjccLMWgRhCZuK5y0zKR3lJ16HdubjKPn-zbLCI62RLejedo9djT34uFi7Va35Q6mwQjH6JQAXN2dz04ew"; // hardcoded to avoid making too many requests
    return
    fetch(url, {
        method: "POST",
        headers: {
            Authorization: "Basic " + btoa(`${client_id}:${client_secret}`),
            "Content-Type": "application/x-www-form-urlencoded",
        }, body: new URLSearchParams({ grant_type: "client_credentials" }),
    })
        .then((response) => response.json())
        .then((tokenResponse) => {
            apiToken = tokenResponse.access_token;
            console.log("tokenResponse: ", tokenResponse.access_token);
        });
}

exports.searchAlbum = searchAlbum;
async function searchAlbum(albumName) {
    return get("https://api.spotify.com/v1/search?type=album&q=" + albumName);
}

/**
 * Get request with the authentication token to the spotify api. If the current token is invalid makes a second request after refreshing the token
 * @param {*} url url of the request, including all parameters
 * @returns a json with the response 
 */
async function get(url) {
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + apiToken,
        },
    });
    let jsonRes = await res.json();
    if (jsonRes?.error?.status == 401) { //token refresh
        console.log("refreshing token...");
        refreshApiToken();
        return await (await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + apiToken,
            },
        })).json()
    }
    return jsonRes;
}