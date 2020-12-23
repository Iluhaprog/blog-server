const request = require('supertest');
const assert = require('assert');
const app = require('../../src/app');
const { RoleApi, UserApi, TagApi } = require('../../src/models');
const { userData, postData } = require('../initObjects');

describe('Test for post api of app', async function() {
    let roleId = 0;

    it('Should create post', async function() {
        const role = await RoleApi.create('ROLE');
        roleId = role.id;
        userData.roleId = roleId;
        const user = await UserApi.create(userData);
        postData.userId = user.id;
        const { body } = await request(app)
                            .post('/post/create')
                            .set('Accept', 'application/json')
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

    it('Should get post by user id', async function() {
        const { body } = await request(app)
                            .get(`/post/getByUserId?userId=${postData.userId}`)
                            .send();
        assert.deepStrictEqual(body, [postData]);
    });

    it('Should update', async function() {
        postData.visible = true;
        const { body } = await request(app)
                            .put('/post/update')
                            .set('Accept', 'application/json')
                            .send({ post: postData });
        assert.deepStrictEqual(body, postData);
    });

    it('Should set tags id to post', async function() {
        const newTag = await TagApi.create({ title: 'JavaScript' });
        const res = await request(app)
                        .put('/post/setTags')
                        .set('Accept', 'application/json')
                        .send({
                            postId: postData.id,
                            tagsId: [newTag.id],
                        });
        assert.strictEqual(res.status, 204);
    });

    it('Should delete by id', async function() {
        const res = await request(app)
                        .delete(`/post/deleteById?id=${postData.id}`)
                        .send();
        await RoleApi.deleteById(roleId);
        assert.strictEqual(res.status, 204);
    });

});