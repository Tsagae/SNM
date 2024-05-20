"use strict";

import playlists from "./playlists.js";
import tracks from "./tracks.js";

/**
 * Generic search in database
 * @param {object} query
 * @param {string[]} filters
 * @returns {Promise<{playlists: *[], tracks: *[]}>}
 */
async function search(query, filters) {
    let res = {
        tracks: [],
        playlists: [],
    }
    if (filters.length === 0) {
        throw new Error("filters can't be empty");
    }
    //filters: ["album", "artist", "track"]
    for (const val of filters) {
        if (val === "playlist") {
            res.playlists = await playlists.searchPublicPlaylists(query.name)
        } else if (val === "track") {
            res.tracks = await tracks.searchTracks(query.name)
        }
    }
    return res
}

export default {search};
