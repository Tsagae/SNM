"use strict";
import spotify from '../spotify.js';

/**
 * https://developer.spotify.com/documentation/web-api/reference/get-track
 * @param {string} id of the track
 */
async function getTrack(id) {
    return spotify.get("https://api.spotify.com/v1/tracks/" + id);
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/get-several-tracks
 * @param {string[]} trackIds of the tracks max 50
 */
async function getTracks(trackIds) {
    if(trackIds.length > 50){
        throw new Error("Max 50 tracks");
    }
    let url = "https://api.spotify.com/v1/tracks?ids=";
    trackIds.forEach((id) => url += id + ",");
    url = url.slice(0, -1);
    return spotify.get(url);
}

/**
 * https://api.spotify.com/v1/search?q=remaster%2520track%3ADoxy%2520artist%3AMiles%2520Davis&type=track
 * @param trackName name of the track
 * @returns {Promise<any>}
 */
async function searchTracks(trackName) {
    return spotify.get("https://api.spotify.com/v1/search?q=" + trackName + "&type=track");
}


export default {getTrack, getTracks, searchTracks};
