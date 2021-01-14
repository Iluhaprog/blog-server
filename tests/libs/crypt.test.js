const assert = require('assert');
const crypt = require('../../src/libs/crypt');

describe('Tests for crypt lib', function() {
    const testString = 'test_string';
    const invalidString = 'invalid_string';
    
    it('Should create hash', async function() {
        const newHash = await crypt.getPasswordHash(testString);
        assert.strictEqual(typeof newHash, 'string');
    });
    
    it('Should compare password with hash', async function() {
        const hash = await crypt.getPasswordHash(testString);

        const isEqual = await crypt.compare(testString, hash);
        assert.strictEqual(isEqual, true);
    });

    it('Should compare invalid password with hash', async function() {
        const hash = await crypt.getPasswordHash(testString);

        const isEqual = await crypt.compare(invalidString, hash);
        assert.strictEqual(isEqual, false);
    }); 

    it('Should generate random string', async function() {
        const rndStr = await crypt.genRandomString(30);
        assert.strictEqual(rndStr.length, 30);
    })
});