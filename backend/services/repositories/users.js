"use strict";

import dataAccess from "../dataAccess.js";
import genresRepository from "./genres.js";
import artistsRepository from "./artists.js";
import mongodb from 'mongodb';


/**
 * Gets a user from the db
 * @param {string} userId of the user to return
 * @returns {Promise<{error: string, statusCode: number}|*>}
 */
async function getUser(userId) {
    let userFromDb = [];
    await dataAccess.executeQuery(async (db) => {
        userFromDb = await db.collection('Users').findOne({
            _id: new mongodb.ObjectId(userId)
        });
    });
    if (userFromDb === null) {
        return {error: "Utente non trovato", statusCode: 404};
    }
    delete userFromDb.email;
    delete userFromDb.password;
    return userFromDb;
}

/**
 * Edits a user
 * @param {string} userid of the user to edit
 * @param {string} username
 * @param {string} email
 * @param {string[]} artists
 * @param {string[]} genres
 * @returns {Promise<{error: string, statusCode: number}|*>}
 */
async function editUser(userid, username, email, artists, genres) {
    let res;
    let dataToChange = {};
    if (username != null) {
        let userInDb;
        await dataAccess.executeQuery(async (db) => {
            userInDb = await db.collection('Users').findOne({
                username: username
            });
        });
        if (userInDb != null) {
            return {error: "Un utente con questo nome è già presente", statusCode: 403};
        }
        dataToChange.username = username;
    }

    if (email != null) {
        let userInDb;
        await dataAccess.executeQuery(async (db) => {
            userInDb = await db.collection('Users').findOne({
                email: email
            });
        });
        if (userInDb != null) {
            return {error: "Un utente con questa email è già presente", statusCode: 403};
        }
        dataToChange.email = email;
    }

    if (artists != null) {
        let artistsFromSpotify = (await artistsRepository.getArtists(artists)).artists
        let i = 0;
        for (let item of artistsFromSpotify) {
            if (item === null) {
                return {error: `L'artista ${artists[i]} non esiste`, statusCode: 404};
            }
            i++;
        }
        dataToChange.artists = artists;
    }

    if (genres != null) {
        let validGenres = (await genresRepository.getGenres()).genres;
        for (let item of genres) {
            if (!validGenres.includes(item)) {
                return {error: `Il genere ${item} non esiste`, statusCode: 404};
            }
        }
        dataToChange.genres = genres;
    }

    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Users').updateOne({_id: new mongodb.ObjectId(userid)}, {
            $set: dataToChange
        });
    });
    return res;
}

/**
 * Deletes a user from the db and all the content associated with him
 * @param {string} userId of the user to delete
 * @returns {Promise<*[]>}
 */
async function deleteUser(userId) {
    let res = [];
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Playlists').deleteMany({
            "user": userId
        });
    });
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Users').deleteOne({
            _id: new mongodb.ObjectId(userId)
        });
    });

    return res;
}


export default {getUser, editUser, deleteUser};
