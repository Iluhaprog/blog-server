const assert = require('assert');

const { TagApi, PostApi, UserApi } = require('../../src/models');
const { postData, userData } = require('../initObjects');

describe('Test api of post model', async function() {
    const post = postData;

    it('Should create post', async function() {
        try {
            const user = await UserApi.create(userData);
            post.userId = user.id;
            const newPost = await PostApi.create(post);
            post.id = newPost.id;
            post.date = newPost.date;
            assert.deepStrictEqual(newPost, post);
        } catch(error) {
            console.error(error);
        }
    });

    it('Should get post by id', async function() {
        try {
            const postData = await PostApi.getById(post.id);
            post.date = postData.date;
            assert.deepStrictEqual(postData, post);
        } catch(error) {
            console.error(error);
        }
    });

    it('Should get all posts', async function() {
        try {
            const posts = await PostApi.getAll({
                page: 0,
                limit: 1,
            });
            assert.deepStrictEqual(posts, [postData]);
        } catch (error) {
            console.error(error)
        }
    });

    it('Should get post by user id', async function() {
        try {
            const postData = await PostApi.getByUserId(post.userId);
            assert.deepStrictEqual(postData, [post]);
        } catch(error) {
            console.error(error);
        }
    });

    it('Should set tags to post', async function() {
        try {
            const tag = { title: 'React' };
            const newTag = await TagApi.create(tag);
            tag.id = newTag.id;

            await PostApi.setTags(post.id, [newTag.id]);

            const tags = await TagApi.getByPostId(post.id);
            assert.deepStrictEqual(tags, [tag]);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should update', async function() {
        try {
            post.visible = true;
            post.title = 'New title';
            await PostApi.update(post);
            const postData = await PostApi.getById(post.id);
            assert.deepStrictEqual(postData, post);
        } catch(error) {
            console.error(error);
        }
    });

    it('Should delete by id', async function() {
        try {
            await PostApi.deleteById(post.id);
            const postData = await PostApi.getById(post.id);
            await UserApi.deleteById(post.userId);

            assert.deepStrictEqual(postData, {});
        } catch(error) {
            console.error(error);
        }
    });
});