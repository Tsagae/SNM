"use strict";
import spotify from '../spotify.js';
import dataAccess from '../dataAccess.js'
import ObjectId from 'mongodb';

/**
 * Gets a playlist from the db
 * @param {string} id of the playlist
 */
async function getPlaylist(id) {
    //db.Playlists.findOne({_id: ObjectId("65182db9baff8944c190d742")})
    let res;
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Playlists').findOne({_id: new ObjectId(id)});
    });
    return res;
}


/**
 * Gets all public playlists from the db
 */
async function getAllPublicPlaylists() {
    let res = [];
    await dataAccess.executeQuery(async (db) => {
        let cursor = await db.collection('Playlists').find({public: true});
        for await (const doc of cursor) {
            res.push(doc);
        }
    });
    return res;
}

/**
 * Edits a playlist
 @param {string} id
 @param {string} user
 @param {string} name
 @param {boolean} isPublic
 @param {string[]} tracks
 @param {string[]} tags
 @throws {Error} if the user is not the owner of the playlist
 */
async function editPlaylist(id, user, name, isPublic, tracks, tags) {
    let res;
    let playlist = await getPlaylist(id);
    if (playlist?.user !== user) {
        throw new Error("You can't edit this playlist");
    }
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Playlists').updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: name,
                public: isPublic,
                tracks: tracks,
                tags: tags
            }
        });
    });
    return res;
}

/**
 * Creates a playlist
 @param {string} user
 @param {string} name
 @param {boolean} isPublic
 @param {string[]} tracks
 @param {string[]} tags
 */
async function createPlaylist(user, name, isPublic, tracks, tags) {
    let res;
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Playlists').insertOne({
            user: user,
            name: name,
            public: isPublic,
            tracks: tracks,
            tags: tags
        });
    });
    return res;
}

/**
 *
 * @param {string} id
 * @param {string} user
 * @returns {Promise<*>}
 * @throws {Error} if the user is not the owner of the playlist
 */
async function deletePlaylist(id, user) {
    let res;
    let playlist = await getPlaylist(id);
    if (playlist?.user !== user) {
        throw new Error("You can't delete this playlist");
    }
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Playlists').deleteOne(db.Playlists.deleteOne({_id: new ObjectId(id)}));
    });
    return res;
}

export default {getPlaylist, getAllPublicPlaylists, editPlaylist, createPlaylist, deletePlaylist};
