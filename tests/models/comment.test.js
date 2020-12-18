const assert = require('assert');
const { CommentApi, PostApi, UserApi, RoleApi } = require('../../src/models/index');

describe('Test comment api', async function() {
    const comment = {
        text: 'Cool post',
    };
    let roleId = 0;

    it('Should create comment', async function() {
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
        comment.userId = user.id;
        comment.postId = post.id;

        const newComment = await CommentApi.create(comment);
        comment.id = newComment.id;
        comment.date = newComment.date;

        assert.deepStrictEqual(newComment, comment);
    });

    it('Should get comment by id', async function() {
        const commentData = await CommentApi.getById(comment.id);
        comment.date = commentData.date;

        assert.deepStrictEqual(commentData, comment);
    });

    it('Should get comment by post id', async function() {
        const commentData = await CommentApi.getByPostId(comment.postId);
        assert.deepStrictEqual(commentData, [comment]);
    });

    it('Should get comment by user id', async function() {
        const commentData = await CommentApi.getByUserId(comment.userId);
        assert.deepStrictEqual(commentData, [comment]);
    });

    it('Should update comment', async function() {
        comment.text = 'Whery cool post!';
        await CommentApi.update(comment);

        const commentData = await CommentApi.getById(comment.id);
        assert.deepStrictEqual(commentData, comment);
    });

    it('Should delete comment by', async function() {
        await CommentApi.deleteById(comment.id);

        const commentData = await CommentApi.getById(comment.id);
        await RoleApi.deleteById(roleId);
        assert.deepStrictEqual(commentData, {});
    });

});