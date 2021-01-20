const session = require('supertest-session');
const assert = require('assert');
const app = require('../../src/app');
const { TagApi, PostApi } = require('../../src/models');
const { postData, auth } = require('../initObjects');

describe('Test for post api of app', async function() {
    var testSession = session(app, {
        befor: function(req) {
            req.set('authorization', auth.header);
        }
    });

    it('Should create post', async function() {
        const user = await testSession
                        .post('/user/login')
                        .set('authorization', auth.admin)
                        .send();
        postData.userId = user.body.id;
        const { body } = await testSession
                            .post(`/post/create`)
                            .set('Accept', 'application/json')
                            .send({ post: postData });
        postData.id = body.id;
        postData.date = body.date;
        postData.directoryId = body.directoryId;
        assert.deepStrictEqual(body, postData);
    });

    it('Should get post by id', async function() {
        const { body } = await testSession
                            .get(`/post/getById?id=${postData.id}`)
                            .send();
        postData.date = body.date;
        assert.deepStrictEqual(body, postData);
    });

    it('Should get all posts', async function() {
        const res = await testSession
                            .get(`/post/getAll/0/1`)
                            .send();
        assert.deepStrictEqual(res.body, [postData]);
    });

    it('Should get post by user id', async function() {
        const { body } = await testSession
                            .get(`/post/getByUserId?userId=${postData.userId}`)
                            .send();
        assert.deepStrictEqual(body, [postData]);
    });

    it('Should update', async function() {
        postData.visible = true;
        const { body } = await testSession
                            .put(`/post/update`)
                            .set('Accept', 'application/json')
                            .send({ post: postData });
        assert.deepStrictEqual(body, postData);
    });

    it('Should set tags id to post', async function() {
        const newTag = await TagApi.create({ title: 'JavaScript' });
        const res = await testSession
                        .put(`/post/setTags`)
                        .set('Accept', 'application/json')
                        .send({
                            postId: postData.id,
                            tagsId: [newTag.id],
                        });
        assert.strictEqual(res.status, 204);
    });

    it('Should delete by id', async function() {
        const res = await testSession
                        .delete(`/post/deleteById?id=${postData.id}`)
                        .send();
        await testSession.post('/user/logout').send();
        await PostApi.deleteById(postData.id);
        assert.strictEqual(res.status, 204);
    });

});