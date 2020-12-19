const assert = require('assert');

const { TagApi, PostApi, UserApi, RoleApi } = require('../../src/models');
const { user: userData, tag: tagData, post: postData } = require('./initObjects');

describe('Test for tag api', async function() {
    const tag = tagData;
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
            
            const newTag = await TagApi.create(tag);
            tag.id = newTag.id;

            assert.deepStrictEqual(newTag, tag);
        } catch(error) {
            console.error(error);
        }
    });

    it ('Should get tag by id', async function() {
        try {
            const tagData = await TagApi.getById(tag.id);
            assert.deepStrictEqual(tagData, tag);
        } catch(error) {
            console.error(error);
        }
    });
    
    it ('Should get tags by post id', async function() {
        try {
            await PostApi.setTags(postId, [tag.id]);
            const tags = await TagApi.getByPostId(postId);
            assert.deepStrictEqual(tags, [tag]);
        } catch(error) {
            console.error(error);
        }
    });

    it ('Should delete by id', async function() {
        try {
            await TagApi.deleteById(tag.id);
            const tagData = await TagApi.getById(tag.id);

            await RoleApi.deleteById(roleId);
            assert.deepStrictEqual(tagData, {});
        } catch(error) {
            console.error(error);
        }
    });
});