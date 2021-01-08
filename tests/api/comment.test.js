const session = require('supertest-session');
const assert = require('assert');
const app = require('../../src/app');
const { UserApi, PostApi } = require('../../src/models');
const { userData, postData, commentData, auth } = require('../initObjects');

describe('Test for comment api of app', async function() {
    var testSession = session(app, {
        befor: function(req) {
            req.set('authorization', auth.header);
        }
    });

    it('Should create comment', async function() {      
        const user = await UserApi.create(userData);
        postData.userId = user.id;
        userData.roleId = user.roleId;
        commentData.userId = user.id;
        await testSession
            .post('/user/login')
            .set('authorization', auth.header)
            .send();
        const post = await PostApi.create(postData);
        commentData.postId = post.id;

        const { body } = await testSession
                            .post(`/comment/create`)
                            .set('Accept', 'application/json')
                            .send({ comment: commentData });
        commentData.id = body.id;
        commentData.date = body.date;
        assert.deepStrictEqual(body, commentData);
    });

    it('Should get comment by id', async function() {
        const { body } = await testSession
                                .get(`/comment/getById?id=${commentData.id}`)
                                .send();
        commentData.date = body.date;
        assert.deepStrictEqual(body, commentData);
    });

    it('Should get all comments', async function() {
        const res = await testSession
                            .get(`/comment/getAll`)
                            .send();
        assert.deepStrictEqual(res.body, [commentData]);
    });

    it('Should get comments by post id', async function() {
        const { body } = await testSession
                                .get(`/comment/getByPostId?postId=${commentData.postId}`)
                                .send();
        assert.deepStrictEqual(body, [commentData]);
    });

    it('Should get comments by user id', async function() {
        const { body } = await testSession
                                .get(`/comment/getByUserId?userId=${commentData.userId}`)
                                .send();
        assert.deepStrictEqual(body, [commentData]) ;
    });

    it('Should update comment', async function() {
        commentData.text = 'New post is cool!';
        const { body } = await testSession
                            .put(`/comment/update`)
                            .set('Accept', 'application/json')
                            .send({ comment: commentData });
        assert.deepStrictEqual(body, commentData);
    });

    it('Should delete comment by id', async function() {
        const res = await testSession
                        .delete(`/comment/deleteById?id=${commentData.id}`)
                        .send();
        await testSession.post('/user/logout').send();
        await UserApi.deleteById(commentData.userId);
        assert.strictEqual(res.status, 204);
    });
});
