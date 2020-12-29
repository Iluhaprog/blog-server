const request = require('supertest');
const assert = require('assert');
const app = require('../../src/app');
const { UserApi, TagApi } = require('../../src/models');
const { userData, postData, auth } = require('../initObjects');

describe('Test for post api of app', async function() {
    it('Should create post', async function() {
        const user = await UserApi.create(userData);
        postData.userId = user.id;
        const { body } = await request(app)
                            .post(`/post/create`)
                            .set('Accept', 'application/json')
                            .set('Authorization', auth.header)
                            .send({ post: postData });
        postData.id = body.id;
        postData.date = body.date;
        assert.deepStrictEqual(body, postData);
    });

    it('Should get post by id', async function() {
        const { body } = await request(app)
                            .get(`/post/getById?id=${postData.id}`)
                            .send();
        postData.date = body.date;
        assert.deepStrictEqual(body, postData);
    });

    it('Should get all posts', async function() {
        const res = await request(app)
                            .get(`/post/getAll`)
                            .send();
        assert.deepStrictEqual(res.body, [postData]);
    });

    it('Should get post by user id', async function() {
        const { body } = await request(app)
                            .get(`/post/getByUserId?userId=${postData.userId}`)
                            .send();
        assert.deepStrictEqual(body, [postData]);
    });

    it('Should update', async function() {
        postData.visible = true;
        const { body } = await request(app)
                            .put(`/post/update`)
                            .set('Accept', 'application/json')
                            .set('Authorization', auth.header)
                            .send({ post: postData });
        assert.deepStrictEqual(body, postData);
    });

    it('Should set tags id to post', async function() {
        const newTag = await TagApi.create({ title: 'JavaScript' });
        const res = await request(app)
                        .put(`/post/setTags`)
                        .set('Accept', 'application/json')
                        .set('Authorization', auth.header)
                        .send({
                            postId: postData.id,
                            tagsId: [newTag.id],
                        });
        assert.strictEqual(res.status, 204);
    });

    it('Should delete by id', async function() {
        const res = await request(app)
                        .delete(`/post/deleteById?id=${postData.id}`)
                        .set('Authorization', auth.header)
                        .send();
        await UserApi.deleteById(postData.userId);
        assert.strictEqual(res.status, 204);
    });

});