const { Comment } = require('./model');
const { getModelData, getModelsDataArray } = require('../../libs/model');

async function create(comment) {
    try {
        const newComment = await Comment.create(comment);
        return getModelData(newComment);
    } catch (error) {
        console.error(error);
    }
}

async function getById(id) {
    try {
        const comment = await Comment.findByPk(id);
        return getModelData(comment);
    } catch (error) {
        console.error(error);
    }
}

async function getAll({ offset, limit }) {
    try {
        const comments = await Comment.findAll({
            offset,
            limit,
        });
        return getModelsDataArray(comments);
    } catch (error) {
        console.error(error);
    }
}

async function getByPostId(postId, pagination) {
    try {
        const { offset, limit } = pagination;
        const postComments = await Comment.findAll({
            offset, limit,
            where: {
                postId: postId,
            },
        });
        return getModelsDataArray(postComments);
    } catch (error) {
        console.error(error);
    }
}

async function getByUserId(userId, pagination) {
    try {
        const { offset, limit } = pagination;
        const userComments = await Comment.findAll({
            offset, limit,
            where: {
                userId: userId,
            },
        });
        return getModelsDataArray(userComments);
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
    getAll,
    getByPostId,
    getByUserId,
    update,
    deleteById,
};