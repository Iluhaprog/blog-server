const assert = require('assert');

const { UserApi, PostApi, LikeApi, DirectoryApi } = require('../../src/models');
const { postData, userData } = require('../initObjects');

describe('Test for like api', async function() {
    let like = {};

    it('Should create like', async function() {
        try {
            const user = await UserApi.create(userData);
            postData.userId = user.id;

            const dir = await DirectoryApi.create('dirname');
            postData.directoryId = dir.id;

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
            await UserApi.deleteById(postData.userId);
            await DirectoryApi.deleteById(postData.directoryId);
            assert.deepStrictEqual(likeData, {});
        } catch (error) {
            console.error(error);
        }
    });
});