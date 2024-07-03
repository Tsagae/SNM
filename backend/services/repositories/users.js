"use strict";

import dataAccess from "../dataAccess.js";
import genresRepository from "./genres.js";
import artistsRepository from "./artists.js";
import mongodb from 'mongodb';


/**
 * Gets a user from the db
 * @param {string} username of the user to return
 * @param {string} userRequesting username of the user making the request
 * @returns {Promise<{error: string, statusCode: number}|*>}
 */
async function getUser(username, userRequesting) {
    let res = [];
    if (username.length === 0) {
        return {error: "User not found", statusCode: 404};
    }
    await dataAccess.executeQuery(async (db) => {
        let cursor = await db.collection('Users').find({
            username: username
        });
        for await (const doc of cursor) {
            res.push(doc);
        }
    });
    if (res.length === 0) {
        return {error: "User not found", statusCode: 404};
    }
    let userToRet = res[0]
    delete userToRet._id;
    delete userToRet.password;
    if (username !== userRequesting) {
        delete userToRet.email;
    }
    return userToRet;
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

export default {getUser, editUser};
