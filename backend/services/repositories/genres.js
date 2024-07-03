"use strict";
import spotify from '../spotify.js';

/**
 * https://developer.spotify.com/documentation/web-api/reference/get-recommendation-genres
 */
async function getGenres() {
    return spotify.get("https://api.spotify.com/v1/recommendations/available-genre-seeds/");
}

export default {getGenres};
