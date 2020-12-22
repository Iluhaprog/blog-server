const request = require('supertest');
const assert = require('assert');
const app = require('../../src/app');
const { RoleApi, UserApi, PostApi } = require('../../src/models');
const { userData, postData, tagData } = require('./initObjects');

describe('Test for tag api of app', async function() {
    let roleId = 0;
    let postId = 0;

    it('Should create tag', async function() {
        const role = await RoleApi.create('ROLE');
        roleId = role.id;
        userData.roleId = roleId;

        const user = await UserApi.create(userData);
        postData.userId = user.id;

        const post = await PostApi.create(postData);
        postId = post.id;

        const { body } = await request(app)
                            .post('/tag/create')
                            .set('Accept', 'application/json')
                            .send({ tag: tagData });
        tagData.id = body.id;
        await PostApi.setTags(post.id, [tagData.id]);

        assert.deepStrictEqual(body, tagData);
    });

    it('Should get tag by id', async function() {
        const { body } = await request(app)
                                .get(`/tag/getById?id=${tagData.id}`)
                                .send();
        assert.deepStrictEqual(body, tagData);
    });

    it('Should get tags by post id', async function() {
        const { body } = await request(app)
                                .get(`/tag/getByPostId?postId=${postId}`)
                                .send();
        assert.deepStrictEqual(body, [tagData]);             
    });

    it('Should delete tag by id', async function() {
        const res = await request(app)
                        .delete(`/comment/deleteById?id=${tagData.id}`)
                        .send();
        await RoleApi.deleteById(roleId);
        assert.strictEqual(res.status, 204);
    });
});
