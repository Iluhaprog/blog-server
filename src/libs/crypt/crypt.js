const bcrypt = require('bcrypt');

const saltRounds = 10;

async function getPasswordHash(password) {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

async function compare(password, hash) {
    return await bcrypt.compare(password, hash);
}

module.exports = {
    getPasswordHash,
    compare,
};