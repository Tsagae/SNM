import {isValidToken} from './backend.js';

export async function checkLogin() {
    if (localStorage.getItem('authToken') === null ||
        localStorage.getItem('username') === null ||
        localStorage.getItem('userId') === null) {
        return false;
    }
    const res = await isValidToken(localStorage.getItem('authToken'));
    if (res.error === undefined) {
        return true;
    }
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('avatar');
    return false;
}