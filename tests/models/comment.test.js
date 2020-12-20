const assert = require('assert');

const { CommentApi, PostApi, UserApi, RoleApi } = require('../../src/models');
const { post: postData, user: userData, comment: commentData } = require('./initObjects');

describe('Test comment api', async function() {
    const comment = commentData;
    let roleId = 0;

    it('Should create comment', async function() {
        try {
            const role = await RoleApi.create('User');
            userData.roleId = role.id;

            const user = await UserApi.create(userData);
            roleId = role.id;
            postData.userId = user.id;

            const post = await PostApi.create(postData);
            comment.userId = user.id;
            comment.postId = post.id;

            const newComment = await CommentApi.create(comment);
            comment.id = newComment.id;
            comment.date = newComment.date;

            assert.deepStrictEqual(newComment, comment);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should get comment by id', async function() {
        try {
            const commentData = await CommentApi.getById(comment.id);
            comment.date = commentData.date;

            assert.deepStrictEqual(commentData, comment);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should get comment by post id', async function() {
        try {
            const commentData = await CommentApi.getByPostId(comment.postId);
            assert.deepStrictEqual(commentData, [comment]);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should get comment by user id', async function() {
        try {
            const commentData = await CommentApi.getByUserId(comment.userId);
            assert.deepStrictEqual(commentData, [comment]);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should update comment', async function() {
        try {
            comment.text = 'Whery cool post!';
            await CommentApi.update(comment);

            const commentData = await CommentApi.getById(comment.id);
            assert.deepStrictEqual(commentData, comment);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should delete comment by', async function() {
        try {
            await CommentApi.deleteById(comment.id);

            const commentData = await CommentApi.getById(comment.id);
            await RoleApi.deleteById(roleId);
            assert.deepStrictEqual(commentData, {});
        } catch (error) {
            console.error(error);
        }
    });
});