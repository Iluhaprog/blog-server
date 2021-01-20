const session = require('supertest-session');
const assert = require('assert');
const app = require('../../src/app');
const path = require('path')
const { PostApi, DirectoryApi } = require('../../src/models');
const { postData, fileData, auth } = require('../initObjects');

describe('Test for file api of app', async function() {
    var testSession = session(app, {
        befor: function(req) {
            req.set('authorization', auth.admin);
        }
    });

    var dirname = '';

    it('Should create file', async function() {
        const user = await testSession
                        .post('/user/login')
                        .set('authorization', auth.admin)
                        .send();

        const dir = await DirectoryApi.create('userDir');
        dirname = dir.name;
        await DirectoryApi.createInDropbox(dir.name);

        const { body } = await testSession
                            .post(`/file/create?dirname=${dir.name}&filename=${fileData.name}`)
                            .attach('file', path.join(__dirname, '/../assets/image.png'));
        fileData.id = body.id;
        fileData.path = body.path,
        fileData.date = body.date;
        fileData.directoryId = body.directoryId;
        assert.deepStrictEqual(body, fileData);
    });

    it('Should get file by id', async function() {
        const { body } = await testSession
                            .get(`/file/getById?id=${fileData.id}`)
                            .send();
        fileData.date = body.date;
        assert.deepStrictEqual(body, fileData);
    });

    it('Should update file', async function() {
        fileData.name = 'newName.png';
        const { body } = await testSession
                                .put(`/file/update`)
                                .set('Accept', 'application/json')
                                .send({ file: fileData });
        assert.deepStrictEqual(body, fileData);
    });

    it('Should delete file by id', async function() {
        const res = await testSession
                        .delete(`/file/deleteById?id=${fileData.id}&dirname=uploads`)
                        .send();
        await testSession.post('/user/logout').send();
        await DirectoryApi.deleteById(fileData.directoryId);
        await DirectoryApi.deleteInDropbox(dirname);
        assert.strictEqual(res.status, 204);
    });

});