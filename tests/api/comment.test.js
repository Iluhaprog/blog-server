const request = require('supertest');
const assert = require('assert');
const app = require('../../src/app');
const { UserApi, PostApi } = require('../../src/models');
const { userData, postData, commentData, auth } = require('../initObjects');

describe('Test for comment api of app', async function() {
    it('Should create comment', async function() {      
        const user = await UserApi.create(userData);
        postData.userId = user.id;
        userData.roleId = user.roleId;
        commentData.userId = user.id;

        const post = await PostApi.create(postData);
        commentData.postId = post.id;

        const { body } = await request(app)
                            .post(`/comment/create`)
                            .set('Accept', 'application/json')
                            .set('Authorization', auth.header)
                            .send({ comment: commentData });
        commentData.id = body.id;
        commentData.date = body.date;
        assert.deepStrictEqual(body, commentData);
    });

    it('Should get comment by id', async function() {
        const { body } = await request(app)
                                .get(`/comment/getById?id=${commentData.id}`)
                                .send();
        commentData.date = body.date;
        assert.deepStrictEqual(body, commentData);
    });

    it('Should get all comments', async function() {
        const res = await request(app)
                            .get(`/comment/getAll`)
                            .send();
        assert.deepStrictEqual(res.body, [commentData]);
    });

    it('Should get comments by post id', async function() {
        const { body } = await request(app)
                                .get(`/comment/getByPostId?postId=${commentData.postId}`)
                                .send();
        assert.deepStrictEqual(body, [commentData]);
    });

    it('Should get comments by user id', async function() {
        const { body } = await request(app)
                                .get(`/comment/getByUserId?userId=${commentData.userId}`)
                                .send();
        assert.deepStrictEqual(body, [commentData]) ;
    });

    it('Should update comment', async function() {
        commentData.text = 'New post is cool!';
        const { body } = await request(app)
                            .put(`/comment/update`)
                            .set('Accept', 'application/json')
                            .set('Authorization', auth.header)
                            .send({ comment: commentData });
        assert.deepStrictEqual(body, commentData);
    });

    it('Should delete comment by id', async function() {
        const res = await request(app)
                        .delete(`/comment/deleteById?id=${commentData.id}`)
                        .set('Authorization', auth.header)
                        .send();
        await UserApi.deleteById(commentData.userId);
        assert.strictEqual(res.status, 204);
    });
});
