const dataAccess = require('../dataAccess')
const ObjectId = require('mongodb').ObjectId;

const spotify = require('../spotify')

module.exports = {getPlaylist, getAllPublicPlaylists, editPlaylist, createPlaylist}

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
 @throws {Error} if the user is not the owner of the playlist
 */
async function editPlaylist(id, user, name, isPublic, tracks) {
    let res;
    await dataAccess.executeQuery(async (db) => {
        let playlist = await getPlaylist(id);
        if (playlist?.user !== user) {
            throw new Error("You can't edit this playlist");
        }
    });
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Playlists').updateOne({_id: new ObjectId(id) }, {
            $set: {
                name: name,
                public: isPublic,
                tracks: tracks
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
 */
async function createPlaylist(user, name, isPublic, tracks) {
    let res;
    await dataAccess.executeQuery(async (db) => {
        res = await db.collection('Playlists').insertOne({
            user: user,
            name: name,
            public: isPublic,
            tracks: tracks
        });
    });
    return res;
}