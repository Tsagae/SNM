"use strict";

import playlists from "./playlists.js";
import tracks from "./tracks.js";

/**
 * Generic search in database
 * @param {object} query
 * @param {string[]} filters
 * @returns {Promise<{error: string, statusCode: number}|{playlists: *[], tracks: *[]}>} error if filters are empty
 */
async function search(query, filters) {
    let res = {
        tracks: [],
        playlists: [],
    }
    if (filters.length === 0) {
        return {error: "filters can't be empty", statusCode: 400};
    }
    //filters: ["album", "artist", "track"]
    for (const val of filters) {
        if (val === "playlist") {
            res.playlists = await playlists.searchPublicPlaylists(query.name);
        } else if (val === "track") {
            res.tracks = await tracks.searchTracks(query.name);
        } else {
            return {error: "filter not recognized", statusCode: 400};
        }
    }
    return res;
}

export default {search};
