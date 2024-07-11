"use strict";

import playlists from "./playlists.js";
import tracks from "./tracks.js";
import albums from "./albums.js";

/**
 * Generic search in database
 * @param {string} query
 * @param {string[]} filters
 * @returns {Promise<{error: string, statusCode: number}|{playlists: *[], tracks: *[]}>} error if filters are empty
 */
async function search(query, filters) {
    let res = {
        tracks: [],
        playlists: [],
        artists: [],
    }
    if (filters.length === 0) {
        return {error: "I filtri non possono essere vuoti", statusCode: 400};
    }
    //filters: ["album", "artist", "track"]
    for (const val of filters) {
        switch (val) {
            case "playlist":
                res.playlists = await playlists.searchPublicPlaylists(query);
                break;
            case "track":
                res.tracks = (await tracks.searchTracks(query)).tracks;
                break;
            default:
                return {error: `Filtro ${val} non riconosciuto`, statusCode: 400};
        }
    }
    return res;
}

export default {search};
