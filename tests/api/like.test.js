const request = require('supertest');
const assert = require('assert');
const app = require('../../src/app');
const { RoleApi, UserApi, PostApi } = require('../../src/models');
const { userData, postData } = require('./initObjects');

describe('Test for comment api of app', async function() {
    let roleId = 0;
    let likeData = {};

    it('Should create like', async function() {
        const role = await RoleApi.create('ROLE');
        roleId = role.id;
        userData.roleId = roleId;

        const user = await UserApi.create(userData);
        postData.userId = user.id;
        likeData.userId = user.id;

        const post = await PostApi.create(postData);
        likeData.postId = post.id;

        const { body } = await request(app)
                            .post('/like/create')
                            .set('Accept', 'application/json')
                            .send({ like: likeData });
        likeData.id = body.id;
        assert.deepStrictEqual(body, likeData);
    });

    it('Should get like by id', async function() {
        const { body } = await request(app)
                                .get(`/like/getById?id=${likeData.id}`)
                                .send();
        assert.deepStrictEqual(body, likeData);
    });

    it('Should get likes by post id', async function() {
        const { body } = await request(app)
                                .get(`/like/getByPostId?postId=${likeData.postId}`)
                                .send();
        assert.deepStrictEqual(body, [likeData]);
    });

    it('Should get likes by user id', async function() {
        const { body } = await request(app)
                                .get(`/like/getByUserId?userId=${likeData.userId}`)
                                .send();
        assert.deepStrictEqual(body, [likeData]);
    });

    it('Should delete like by id', async function() {
        const res = await request(app)
                        .delete(`/like/deleteById?id=${likeData.id}`)
                        .send();
        await RoleApi.deleteById(roleId);
        assert.strictEqual(res.status, 204);
    });
});