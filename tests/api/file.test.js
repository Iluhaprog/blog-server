const session = require('supertest-session');
const assert = require('assert');
const app = require('../../src/app');
const { PostApi } = require('../../src/models');
const { postData, fileData, auth } = require('../initObjects');

describe('Test for file api of app', async function() {
    var testSession = session(app, {
        befor: function(req) {
            req.set('authorization', auth.admin);
        }
    });

    it('Should create file', async function() {
        const user = await testSession
                        .post('/user/login')
                        .set('authorization', auth.admin)
                        .send();
        postData.userId = user.body.id;

        const post = await PostApi.create(postData);
        fileData.postId = post.id;

        const { body } = await testSession
                            .post(`/file/create`)
                            .set('Accept', 'application/json')
                            .send({ file: fileData });
        fileData.id = body.id;
        fileData.date = body.date;
        assert.deepStrictEqual(body, fileData);
    });

    it('Should get file by id', async function() {
        const { body } = await testSession
                            .get(`/file/getById?id=${fileData.id}`)
                            .send();
        fileData.date = body.date;
        assert.deepStrictEqual(body, fileData);
    });

    it('Should get files by post id', async function() {
        const { body } = await testSession
                            .get(`/file/getByPostId?postId=${fileData.postId}`)
                            .send();
        assert.deepStrictEqual(body, [fileData]);
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
                        .delete(`/file/deleteById?id=${fileData.id}`)
                        .send();
        await testSession.post('/user/logout').send();
        await PostApi.deleteById(fileData.postId);
        assert.strictEqual(res.status, 204);
    });

});