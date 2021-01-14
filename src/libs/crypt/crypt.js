const bcrypt = require('bcrypt');

const saltRounds = 10;

async function getPasswordHash(password) {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

async function genRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function compare(password, hash = "") {
    return await bcrypt.compare(password, hash);
}

module.exports = {
    getPasswordHash,
    compare,
    genRandomString,
};