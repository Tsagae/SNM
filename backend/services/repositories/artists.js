const spotify = require('../spotify')

module.exports = { getArtist }

/**
 * https://developer.spotify.com/documentation/web-api/reference/get-an-artist
 * @param {string} id of the artist
 */
async function getArtist(id) {
    return spotify.get("https://api.spotify.com/v1/artists/" + id);
}
