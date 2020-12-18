const comment = require('.');
const { Comment } = require('./model');

async function create(comment) {
    try {
        const newComment = await Comment.create(comment);
        return newComment ? newComment.get({ plain:true }) : {};
    } catch (error) {
        console.error(error);
    }
}

async function getById(id) {
    try {
        const comment = await Comment.findByPk(id);
        return comment ? comment.get({ plain: true }) : {};
    } catch (error) {
        console.error(error);
    }
}

async function getByPostId(postId) {
    try {
        const postComments = await Comment.findAll({
            where: {
                postId: postId,
            },
        });
        const comments = postComments.map(comment => comment.get({ plain: true }));
        return comments;
    } catch (error) {
        console.error(error);
    }
}

async function getByUserId(userId) {
    try {
        const postComments = await Comment.findAll({
            where: {
                userId: userId,
            },
        });
        const comments = postComments.map(comment => comment.get({ plain: true }));
        return comments;
    } catch (error) {
        console.error(error);
    }
}

async function update(comment) {
    try {
        await Comment.update(comment, { 
            where: {
                id: comment.id,
            },
        });
    } catch (error) {
        console.error(error);
    }
}

async function deleteById(id) {
    try {
        await Comment.destroy({
            where: {
                id: id,
            },
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    create, 
    getById,
    getByPostId,
    getByUserId,
    update,
    deleteById,
};