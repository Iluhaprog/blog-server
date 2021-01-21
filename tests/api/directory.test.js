const session = require('supertest-session');
const assert = require('assert');
const app = require('../../src/app');
const { DirectoryApi } = require('../../src/models');
const { auth } = require('../initObjects');

describe('Test for directory api of app', async function() {
    var testSession = session(app, {
        befor: function(req) {
            req.set('authorization', auth.admin);
        }
    });

    it('Should get directory by id', async function() {
        const newDir = await DirectoryApi.create('testDir');
        const { body } = await testSession
                                    .get(`/directory/getById?id=${newDir.id}`)
                                    .send();
        await DirectoryApi.deleteById(newDir.id);
        assert.deepStrictEqual(body, newDir);
    });
});