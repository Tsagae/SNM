"use strict";
import dataAccess from '../dataAccess.js'
import mongodb from 'mongodb';

/**
 *
 Gets a playlist from the db
 * @param {string} id of the playlist
 * @param {string} user that is requesting the playlist* @param id
 * @returns {Promise<{error: string, statusCode: number}|{public}|*>} error if the user is not the owner of the playlist and the playlist is private
 */
async function getPlaylist(id, user) {
    let res;
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Playlists').findOne({_id: new mongodb.ObjectId(id)});
    });
    if (res == null) {
        return {error: "Playlist non trovata", statusCode: 404};
    }
    let isPublic = false;
    if (typeof res?.public == "boolean") {
        isPublic = res?.public;
    } else {
        isPublic = res?.public === "true";
    }
    if (!isPublic && res?.user !== user) {
        return {error: "Non puoi visualizzare questa playlist", statusCode: 403};
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
 @param {string} description
 @returns {Promise<{error: string, statusCode: number}|*>} error if the user is not the owner of the playlist
 */
async function editPlaylist(id, user, name, isPublic, tracks, tags, description) {
    let res;
    let playlist = await getPlaylist(id, user);
    if (playlist?.user !== user) {
        return {error: "Non puoi modificare questa playlist", statusCode: 403};
    }
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Playlists').updateOne({_id: new mongodb.ObjectId(id)}, {
            $set: {
                name: name,
                public: isPublic,
                tracks: tracks,
                tags: tags,
                description: description
            }
        });
    });
    return res;
}

/**
 * Adds a track to a playlist. Does nothing if the track is already in the playlist
 * @param userId the user making the request
 * @param playlistId of the playlist to add the track to
 * @param trackId of the track to add
 * @returns {Promise<{error: string, statusCode: number}|*>}
 */
async function addTrackToPlaylist(userId, playlistId, trackId) {
    let res;
    let playlist = await getPlaylist(playlistId, userId);
    let newTracks = playlist.tracks;
    if (!newTracks.includes(trackId)) {
        newTracks.push(trackId);
    }
    return await editPlaylist(playlistId, userId, playlist.name, playlist.public, newTracks, playlist.tags, playlist.description);
}

/**
 * Removed a track from a playlist. Does nothing if the track is not in the playlist
 * @param userId the user making the request
 * @param playlistId of the playlist to remove the track from
 * @param trackId of the track to remove
 * @returns {Promise<{error: string, statusCode: number}|*>}
 */
async function removeTrackFromPlaylist(userId, playlistId, trackId) {
    let res;
    let playlist = await getPlaylist(playlistId, userId);
    let newTracks = playlist.tracks;
    newTracks = newTracks.filter((item) => item !== trackId)
    return await editPlaylist(playlistId, userId, playlist.name, playlist.public, newTracks, playlist.tags, playlist.description);
}

/**
 * Creates a playlist
 @param {string} userId
 @param {string} name
 @param {boolean} isPublic
 @param {string[]} tracks
 @param {string[]} tags
 @param {string} description
 */
async function createPlaylist(userId, name, isPublic, tracks, tags, description) {
    let res;
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Playlists').insertOne({
            user: userId,
            name: name,
            public: isPublic,
            tracks: tracks,
            tags: tags,
            description: description
        });
    });
    return res;
}

/**
 *
 * @param {string} id
 * @param {string} user
 * @returns {Promise<*>}
 * @returns {Promise<*|{error: string, statusCode: number}>} error if the user is not the owner of the playlist
 */
async function deletePlaylist(id, user) {
    let res;
    let playlist = await getPlaylist(id);
    if (playlist?.user !== user) {
        return {error: "Non puoi cancellare questa playlist", statusCode: 403};
    }
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Playlists').deleteOne({_id: new mongodb.ObjectId(id)});
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

/**
 * Returns all playlists of a user
 * @param userId
 * @returns {Promise<*[]>}
 */
async function getAllUserPlaylists(userId) {
    let res = [];
    await dataAccess.executeQuery(async (db) => {
        let cursor = await db.collection('Playlists').find({
            user: userId
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
    searchPublicPlaylists,
    getAllUserPlaylists,
    addTrackToPlaylist,
    removeTrackFromPlaylist
};
