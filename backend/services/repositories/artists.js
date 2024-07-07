"use strict";
import spotify from '../spotify.js';

/**
 * https://developer.spotify.com/documentation/web-api/reference/get-an-artist
 * @param {string} id of the artist
 */
async function getArtist(id) {
    return spotify.get("https://api.spotify.com/v1/artists/" + id);
}

/**
 *
 * https://developer.spotify.com/documentation/web-api/reference/get-multiple-artists
 * @param {string[]} artistsIds of the artists max 50
 * @returns {Promise<any|{error: string, statusCode: number}>}
 */
async function getArtists(artistsIds) {
    if (artistsIds.length > 50) {
        return {error: "Max 50 artists", statusCode: 400};
    }
    let url = "https://api.spotify.com/v1/artists?ids=";
    artistsIds.forEach((id) => url += id + ",");
    url = url.slice(0, -1);
    return spotify.get(url);
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/search
 * @param artistName name of the artist
 * @returns {Promise<any>}
 */
async function searchArtist(artistName) {
    return spotify.get("https://api.spotify.com/v1/search?q=" + artistName + "&type=artist");
}

export default {getArtist, getArtists, searchArtist};
