"use strict";

import dataAccess from "../dataAccess.js";

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

export default {getUser};
