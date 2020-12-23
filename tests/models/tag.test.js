const assert = require('assert');

const { TagApi, PostApi, UserApi, RoleApi } = require('../../src/models');
const { userData, tagData, postData } = require('../initObjects');

describe('Test for tag api', async function() {
    let roleId = 0;
    let postId = 0;

    it ('Should create tag', async function() {
        try {
            const role = await RoleApi.create('User');
            userData.roleId = role.id;

            const user = await UserApi.create(userData);
            roleId = role.id;

            postData.userId = user.id;
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

    it ('Should delete by id', async function() {
        try {
            await TagApi.deleteById(tagData.id);
            const tag = await TagApi.getById(tagData.id);

            await RoleApi.deleteById(roleId);
            assert.deepStrictEqual(tag, {});
        } catch(error) {
            console.error(error);
        }
    });
});