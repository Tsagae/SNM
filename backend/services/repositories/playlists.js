"use strict";
import dataAccess from '../dataAccess.js'
import mongodb from 'mongodb';

/**
 * Gets a playlist from the db
 @param {string} id of the playlist
 @param {string} user that is requesting the playlist
 @throws {Error} if the user is not the owner of the playlist and the playlist is private
 */
async function getPlaylist(id, user) {
    let res;
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Playlists').findOne({_id: new mongodb.ObjectId(id)});
    });
    if (!res?.public && res?.user !== user) {
        throw new Error("You can't see this playlist");
    }
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
    let playlist = await getPlaylist(id, user);
    if (playlist?.user !== user) {
        throw new Error("You can't edit this playlist");
    }
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Playlists').updateOne({_id: new mongodb.ObjectId(id)}, {
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
        res = await db.collection('Playlists').deleteOne(db.Playlists.deleteOne({_id: new mongodb.ObjectId(id)}));
    });
    return res;
}


/**
 * Searches in all public playlists
 * @param {string} name
 */
async function searchPublicPlaylists(name) {
    let res = [];
    if (name.length === 0) {
        return res;
    }
    await dataAccess.executeQuery(async (db) => {
        let cursor = await db.collection('Playlists').find({
            public: true,
            name: {$regex: new RegExp(".*" + name + ".*", "i")}
        });
        for await (const doc of cursor) {
            res.push(doc);
        }
    });
    return res;
}


export default {
    getPlaylist,
    getAllPublicPlaylists,
    editPlaylist,
    createPlaylist,
    deletePlaylist,
    searchPublicPlaylists
};
