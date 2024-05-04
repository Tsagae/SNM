"use strict";
import spotify from '../spotify.js';

/**
 * https://developer.spotify.com/documentation/web-api/reference/get-an-album
 * @param {string} id of the album
 */
async function getAlbum(id) {
    return spotify.get("https://api.spotify.com/v1/albums/" + id);
}

export default {getAlbum};
