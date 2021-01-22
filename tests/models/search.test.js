const assert = require('assert');
const { PostApi, UserApi, TagApi, DirectoryApi } = require('../../src/models');
const { postData, userData, tagData } = require('../initObjects');

describe('Test for search', async function() {
    it('Should search posts by title and tags', async function() {
        delete postData['id'];
        delete userData['id'];

        const newUser = await UserApi.create(userData);
        postData.userId = newUser.id;

        const newDir1 = await DirectoryApi.create('test');
        const newDir2 = await DirectoryApi.create('react');

        const newPost1 = await PostApi.create({
            ...postData, 
            title: 'Test title',
            directoryId: newDir1.id,
        });
        const newPost2 = await PostApi.create({
            ...postData, 
            title: 'React title',
            directoryId: newDir2.id,
        });

        const newTag1 = await TagApi.create({ title: 'Test'});
        const newTag2 = await TagApi.create({ title: 'React'});
        await PostApi.setTags(newPost1.id, [newTag1.id]);
        await PostApi.setTags(newPost2.id, [newTag2.id, newTag1.id]);
        const result = await PostApi.search('title', ['React', 'Test'], 0);

        await UserApi.deleteById(newUser.id);
        await DirectoryApi.deleteById(newDir1.id);
        await DirectoryApi.deleteById(newDir2.id);
        await TagApi.deleteById(newTag1.id);
        await TagApi.deleteById(newTag2.id);


        assert.strictEqual(result.posts.length, 2);
        assert.strictEqual(result.count, 2);
    });
});