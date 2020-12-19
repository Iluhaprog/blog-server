const assert = require('assert');
const { TagApi, PostApi, UserApi, RoleApi } = require('../../src/models/index');

describe('Test api of post model', async function() {
    const post = {
        title: 'My first project',
        description: 'I tell you about problems with wich i will face',
        preview: 'preview.png',
        text: 'bla bla bla',
        visible: false,
    };

    let roleId = 0;

    it('Should create post', async function() {
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
        post.userId = user.id;
        const newPost = await PostApi.create(post);
        post.id = newPost.id;
        post.date = newPost.date;
        assert.deepStrictEqual(newPost, post);
    });

    it('Should get post by id', async function() {
        const postData = await PostApi.getById(post.id);
        post.date = postData.date;
        assert.deepStrictEqual(postData, post);
    });

    it('Should get post by user id', async function() {
        const postData = await PostApi.getByUserId(post.userId);
        assert.deepStrictEqual(postData, [post]);
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

    it('Sould update', async function() {
        post.visible = true;
        post.title = 'New title';
        await PostApi.update(post);
        const postData = await PostApi.getById(post.id);
        assert.deepStrictEqual(postData, post);
    });

    it('Should delete by id', async function() {
        await PostApi.deleteById(post.id);
        const postData = await PostApi.getById(post.id);
        assert.deepStrictEqual(postData, {});

        await RoleApi.deleteById(roleId);
    });
});