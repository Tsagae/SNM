"use strict";
import spotify from '../spotify.js';

/**
 https://developer.spotify.com/documentation/web-api/reference/search
 @param {string} query
 @param {string[]} filters can't be empty and has to be one of ["album", "artist", "playlist", "track"] or any combination of them
 */
async function search(query, filters) {
    if (filters.length === 0) {
        throw new Error("filters can't be empty");
    }
    let url = "https://api.spotify.com/v1/search?type=";
    //filters: ["album", "artist", "track"]
    for (const val of filters) {
        if (val === "playlist") {
            //TODO Playlists must me pulled from the db and not from spotify's api
            continue;
        }
        url += `${val},`;
    }
    url = url.slice(0, -1);
    return spotify.get(url + "&q=" + query);
}

export default {search};
