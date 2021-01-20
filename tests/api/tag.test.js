const session = require('supertest-session');
const assert = require('assert');
const app = require('../../src/app');
const { PostApi, DirectoryApi } = require('../../src/models');
const { postData, tagData, auth } = require('../initObjects');

describe('Test for tag api of app', async function() {
    let postId = 0;

    var testSession = session(app, {
        befor: function(req) {
            req.set('authorization', auth.admin);
        }
    });
    
    it('Should create tag', async function() {
        
        const userData = await testSession
                            .post('/user/login')
                            .set('authorization', auth.admin)
                            .send();
        postData.userId = userData.body.id;

        const dir = await DirectoryApi.create('commentDir');
        postData.directoryId = dir.id;

        const post = await PostApi.create(postData);
        postId = post.id;

        const { body } = await testSession
                            .post(`/tag/create`)
                            .set('Accept', 'application/json')
                            .send({ tag: tagData });
        tagData.id = body.id;
        await PostApi.setTags(post.id, [tagData.id]);

        assert.deepStrictEqual(body, tagData);
    });

    it('Should get tag by id', async function() {
        const { body } = await testSession
                                .get(`/tag/getById?id=${tagData.id}`)
                                .send();
        assert.deepStrictEqual(body, tagData);
    });

    it('Should get tags by post id', async function() {
        const { body } = await testSession
                                .get(`/tag/getByPostId?postId=${postId}`)
                                .send();
        assert.deepStrictEqual(body, [tagData]);             
    });

    it('Should delete tag by id', async function() {
        const res = await testSession
                        .delete(`/comment/deleteById?id=${tagData.id}`)
                        .set('authorization', auth.admin)
                        .send();
        await testSession.post('/user/logout').send();
        await PostApi.deleteById(postId);
        await DirectoryApi.deleteById(postData.directoryId);
        assert.strictEqual(res.status, 204);
    });
});
