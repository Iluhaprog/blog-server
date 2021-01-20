const session = require('supertest-session');
const assert = require('assert');
const app = require('../../src/app');
const { UserApi, PostApi, DirectoryApi } = require('../../src/models');
const { userData, postData, auth } = require('../initObjects');

describe('Test for like api of app', async function() {
    let likeData = {};
    var testSession = session(app, {
        befor: function(req) {
            req.set('authorization', auth.header);
        }
    });

    it('Should create like', async function() {
        const { body: user } = await testSession
                            .post('/user/create')
                            .set('Accept', 'application/json')
                            .send({ user: userData });
        postData.userId = user.id;
        likeData.userId = user.id;
        await testSession
            .post('/user/login')
            .set('authorization', auth.admin)
            .send();

        const dir = await DirectoryApi.create('likeDir');
        postData.directoryId = dir.id;

        const post = await PostApi.create(postData);
        likeData.postId = post.id;

        const { body } = await testSession
                            .post(`/like/create`)
                            .set('Accept', 'application/json')
                            .send({ like: likeData });
        likeData.id = body.id;
        assert.deepStrictEqual(body, likeData);
    });

    it('Should get like by id', async function() {
        const { body } = await testSession
                                .get(`/like/getById?id=${likeData.id}`)
                                .send();
        assert.deepStrictEqual(body, likeData);
    });

    it('Should get all likes', async function() {
        const res = await testSession
                            .get(`/like/getAll`)
                            .send();
        assert.deepStrictEqual(res.body, [likeData]);
    });

    it('Should get likes by post id', async function() {
        const { body } = await testSession
                                .get(`/like/getByPostId?postId=${likeData.postId}`)
                                .send();
        assert.deepStrictEqual(body, [likeData]);
    });

    it('Should get likes by user id', async function() {
        const { body } = await testSession
                                .get(`/like/getByUserId?userId=${likeData.userId}`)
                                .send();
        assert.deepStrictEqual(body, [likeData]);
    });

    it('Should delete like by id', async function() {
        const res = await testSession
                        .delete(`/like/deleteById?id=${likeData.id}`)
                        .send();
        await testSession.post('/user/logout').send();
        await UserApi.deleteById(likeData.userId);
        await DirectoryApi.deleteById(postData.directoryId);
        assert.strictEqual(res.status, 204);
    });
});