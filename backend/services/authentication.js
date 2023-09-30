const jwt = require('jsonwebtoken');
const config = require('config');
const {matchedData, validationResult} = require('express-validator');
const dataAccess = require('./dataAccess');
const bcrypt = require("bcrypt")

const authSecret = config.get('auth.secret');

async function hash(text) {
    return await bcrypt.hash(text, 10);
}

async function compareHashed(plaintext, hash) {
    return await bcrypt.compare(plaintext, hash);
}

// Registration and login
exports.login = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    } else {
        const data = matchedData(req);
        const username = data.username;
        const password = data.password;
        let queryResult = [];
        let cursor;
        let successfulLogin = false;
        await dataAccess.executeQuery(async (db) => {
            cursor = await db.collection('Users').find({
                username: username,
            });
            for await (const doc of cursor) {
                queryResult.push(doc);
            }
        });
        if (queryResult.length === 1 && password != null) {
            successfulLogin = await compareHashed(password, queryResult[0].password);
        } else if (queryResult.length > 1) {
            console.log("more than one user with the same name");
        }
        if (successfulLogin) {
            return res.send({accessToken: generateAccessToken({username: username})});
        }
        return res.status(401).send({result: "invalid login"});
    }
}

exports.registerUser = function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    } else {
        const data = matchedData(req);
        const username = data.username;
        const email = data.email;
        const password = data.password;
        dataAccess.executeQuery(async (db) => {
            await db.collection('Users').insertOne({
                username: username,
                email: email,
                password: await hash(password),
            });
        });
        return res.send({result: `registered successfully! ${username}`});
    }
}


/**
 * Generates a signed jwt token
 * @param {*} user
 * @param {int} expiringTime in seconds
 * @returns a signed jwt token
 */
function generateAccessToken(user, expiringTime = 1800) {
    //console.log("expiration: ", expiringTime + 's');
    return jwt.sign(user, authSecret, {expiresIn: expiringTime + 's'});
}


/**
 * Authenticates a request by checking the token in the authorization header
 * @param req
 * @param res
 * @returns null if the token is valid, responds with 401 if the token is not present, responds with 403 if the token is invalid
 */
exports.authenticateRequest = function (req, res) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    let tokenValidation;
    tokenValidation = authenticateToken(token);
    console.log(tokenValidation);
    if (tokenValidation == null) return res.sendStatus(401);
    if (tokenValidation.err != null) return res.status(403).send({result: "invalid token"});
    //return res.send({user: tokenValidation.user});
    return null;
}


/**
 * authenticates a token returning the user that requested the token or an error
 * @param {string} token authentication token
 * @returns tokenValidation: {user, err}
 */
function authenticateToken(token) {
    if (token == null) return null;
    let tokenUser = {user: null, err: null};
    jwt.verify(token, authSecret, (err, user) => {

        if (err) {
            //console.log(err);
            tokenUser.err = err;
            return tokenUser
        }

        tokenUser.user = user;
    });
    return tokenUser;
}

exports.generateSecret = function () {
    return require('crypto').randomBytes(64).toString('hex')
};





