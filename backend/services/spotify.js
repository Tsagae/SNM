const config = require('config');
const dataAccess = require('./dataAccess');


const client_id = config.get('spotify.clientId')
const client_secret = config.get('spotify.clientSecret')
var url = "https://accounts.spotify.com/api/token"

let apiToken;
updateApiTokenFromDB();

function updateApiTokenFromDB() {
    console.log("loading token from db...");
    let res;
    dataAccess.executeQuery(async (db) => {
        res = await db.collection('Api').findOne({_id: 0});
    }).then(() => {
        console.log("token loaded from db");
        console.log("token: ", res.spotifyApiToken);
        apiToken = res.spotifyApiToken;
    });
}

/**
 * Refreshes the current api token
 */
async function refreshApiToken() {
    await fetch(url, {
        method: "POST",
        headers: {
            Authorization: "Basic " + btoa(`${client_id}:${client_secret}`),
            "Content-Type": "application/x-www-form-urlencoded",
        }, body: new URLSearchParams({grant_type: "client_credentials"}),
    })
        .then((response) => response.json())
        .then((tokenResponse) => {
            apiToken = tokenResponse.access_token;
            console.log("tokenResponse: ", tokenResponse.access_token);
            dataAccess.executeQuery(async (db) => {
                await db.collection('Api').updateOne({_id: 0}, {$set: {spotifyApiToken: apiToken}});
            }).then(() => console.log("token updated on db"));
        });
}

/**
 https://developer.spotify.com/documentation/web-api/reference/search
 @param {string} query
 @param {string[]} filters can't be empty and has to be one of ["album", "artist", "playlist", "track"] or any combination of them
 */
exports.search = async function search(query, filters) {
    if (filters.length === 0) {
        throw new Error("filters can't be empty");
    }
    let url = "https://api.spotify.com/v1/search?type=";
    //filters: ["album", "artist", "playlist", "track"]
    for (const val of filters) {
        url += `${val},`;
    }
    url = url.slice(0, -1);
    return get(url + "&q=" + query);
}


/**
 * Get request with the authentication token to the spotify api. If the current token is invalid makes a second request after refreshing the token
 * @param {string} url url of the request, including all parameters
 * @returns res json with the response
 */
async function get(url) {
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + apiToken,
        },
    });
    let jsonRes = await res.json();
    if (jsonRes?.error?.status === 401) { //token refresh
        console.log("refreshing token...");
        await refreshApiToken();
        return await (await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + apiToken,
            },
        })).json()
    }
    return jsonRes;
}