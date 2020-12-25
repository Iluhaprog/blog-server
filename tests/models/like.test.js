const assert = require('assert');

const { RoleApi, UserApi, PostApi, LikeApi } = require('../../src/models');
const { postData, userData } = require('../initObjects');

describe('Test for like api', async function() {
    let like = {};
    let roleId = 0;

    it('Should create like', async function() {
        try {
            const role = await RoleApi.create('User');
            userData.roleId = role.id;
            const user = await UserApi.create(userData);
            roleId = role.id;

            postData.userId = user.id;
            const post = await PostApi.create(postData);
            like = {
                userId: user.id,
                postId: post.id,
            };

            const newLike = await LikeApi.create(like);
            like.id = newLike.id;

            assert.deepStrictEqual(newLike, like);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should get like by id', async function() {
        try {
            const likeData = await LikeApi.getById(like.id);
            assert.deepStrictEqual(likeData, like);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should get all likes', async function() {
        try {
            const likes = await LikeApi.getAll();
            assert.deepStrictEqual(likes, [like]);
        } catch (error) {
            console.error(error)
        }
    });

    it('Should get likes by user id', async function() {
        try {
            const likes = await LikeApi.getByUserId(like.userId);
            assert.deepStrictEqual(likes, [like]);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should get likes by post id', async function() {
        try {
            const likes = await LikeApi.getByPostId(like.postId);
            assert.deepStrictEqual(likes, [like]);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should delete like by id', async function() {
        try {
            await LikeApi.deleteById(like.id);
            const likeData = await LikeApi.getById(like.id);
            await RoleApi.deleteById(roleId);
            assert.deepStrictEqual(likeData, {});
        } catch (error) {
            console.error(error);
        }
    });
});