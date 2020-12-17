const assert = require('assert');
const { RoleApi, UserApi, PostApi, LikeApi } = require('../../src/models');

describe('Test for like api', async function() {
    let like = {};
    let roleId = 0;

    it('Should create like', async function() {
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
        like = {
            userId: user.id,
            postId: post.id,
        };

        const newLike = await LikeApi.create(like);
        like.id = newLike.id;

        assert.deepStrictEqual(newLike, like);
    });

    it('Should get like by id', async function() {
        const likeData = await LikeApi.getById(like.id);
        assert.deepStrictEqual(likeData, like);
    });

    it('Should get likes by user id', async function() {
        const likes = await LikeApi.getByUserId(like.userId);
        assert.deepStrictEqual(likes, [like]);
    });

    it('Should get likes by post id', async function() {
        const likes = await LikeApi.getByPostId(like.postId);
        assert.deepStrictEqual(likes, [like]);
    });

    it('Should delete like by id', async function() {
        await LikeApi.deleteById(like.id);
        const likeData = await LikeApi.getById(like.id);
        await RoleApi.deleteById(roleId);
        assert.deepStrictEqual(likeData, {});
    });
});