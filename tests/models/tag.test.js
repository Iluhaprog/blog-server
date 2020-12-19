const assert = require('assert');
const { TagApi, PostApi, UserApi, RoleApi } = require('../../src/models/index');

describe('Test for tag api', async function() {
    const tag = {
        title: 'React',
    };
    let roleId = 0;
    let postId = 0;

    it ('Should create tag', async function() {
        const role = await RoleApi.create('User');

        const user = await UserApi.create({
            firstName: 'Ilya',
            lastName: 'Novak',
            username: 'ilyaNovak',
            email: 'rickmortyand4@gmail.com',
            bio: '',
            password: '123456',
            salt: '',
            roleId: role.id,
        });
        roleId = role.id;

        const post = await PostApi.create({
            title: 'My first project',
            description: 'I tell you about problems with wich i will face',
            preview: 'preview.png',
            text: 'bla bla bla',
            visible: false,
            userId: user.id,
        });
        postId = post.id;
        
        const newTag = await TagApi.create(tag);
        tag.id = newTag.id;

        assert.deepStrictEqual(newTag, tag);
    });

    it ('Should get tag by id', async function() {
        const tagData = await TagApi.getById(tag.id);
        assert.deepStrictEqual(tagData, tag);
    });
    
    it ('Should get tags by post id', async function() {
        await PostApi.setTags(postId, [tag.id]);
        const tags = await TagApi.getByPostId(postId);
        assert.deepStrictEqual(tags, [tag]);
    });

    it ('Should delete by id', async function() {
        await TagApi.deleteById(tag.id);
        const tagData = await TagApi.getById(tag.id);

        await RoleApi.deleteById(roleId);
        assert.deepStrictEqual(tagData, {});
    });

});