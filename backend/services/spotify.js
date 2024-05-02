"use strict";
import config from 'config';
import dataAccess from './dataAccess.js';

const client_id = config.get('spotify.clientId')
const client_secret = config.get('spotify.clientSecret')
const url = "https://accounts.spotify.com/api/token";

let apiToken;
updateApiTokenFromDB();

/**
 * Get request with the authentication token to the spotify api. If the current token is invalid makes a second request after refreshing the token
 * @param {string} url url of the request, including all parameters
 * @returns res json with the response
 */
async function get(url) {
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json", Authorization: "Bearer " + apiToken,
        },
    });
    let jsonRes = await res.json();
    if (jsonRes?.error?.status === 401) { //token refresh
        console.log("refreshing token...");
        await refreshApiToken();
        return await (await fetch(url, {
            headers: {
                "Content-Type": "application/json", Authorization: "Bearer " + apiToken,
            },
        })).json()
    }
    return jsonRes;
}

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
        method: "POST", headers: {
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


export default {get};
