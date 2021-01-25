const assert = require('assert');

const { TagApi, PostApi, UserApi, DirectoryApi } = require('../../src/models');
const { userData, tagData, postData } = require('../initObjects');

describe('Test for tag api', async function() {
    let postId = 0;

    it ('Should create tag', async function() {
        try {
            const user = await UserApi.create(userData);
            postData.userId = user.id;

            const dir = await DirectoryApi.create('dirname');
            postData.directoryId = dir.id;

            const post = await PostApi.create(postData);
            postId = post.id;
            
            delete tagData.id;
            const newTag = await TagApi.create(tagData);
            tagData.id = newTag.id;

            assert.deepStrictEqual(newTag, tagData);
        } catch(error) {
            console.error(error);
        }
    });

    it ('Should get tag by id', async function() {
        try {
            const tag = await TagApi.getById(tagData.id);
            assert.deepStrictEqual(tag, tagData);
        } catch(error) {
            console.error(error);
        }
    });
    
    it ('Should get tags by post id', async function() {
        try {
            await PostApi.setTags(postId, [tagData.id]);
            const tags = await TagApi.getByPostId(postId);
            assert.deepStrictEqual(tags, [tagData]);
        } catch(error) {
            console.error(error);
        }
    });

    it('Should get all tags', async function() {
        try {
            const tags = await TagApi.getAll();
            assert.deepStrictEqual(Array.isArray(tags), true);
        } catch (error) {
            console.error(error);
        }
    });

    it ('Should delete by id', async function() {
        try {
            await TagApi.deleteById(tagData.id);
            const tag = await TagApi.getById(tagData.id);

            await UserApi.deleteById(postData.userId);
            await DirectoryApi.deleteById(postData.directoryId);
            assert.deepStrictEqual(tag, {});
        } catch(error) {
            console.error(error);
        }
    });
});