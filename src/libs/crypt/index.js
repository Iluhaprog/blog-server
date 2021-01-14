const { getPasswordHash, compare, genRandomString } = require('./crypt');

module.exports = {
    getPasswordHash,
    compare,
    genRandomString
};