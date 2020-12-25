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

async function getAll() {
    try {
        const comments = await Comment.findAll();
        return getModelsDataArray(comments);
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
        return getModelsDataArray(postComments);
    } catch (error) {
        console.error(error);
    }
}

async function getByUserId(userId) {
    try {
        const userComments = await Comment.findAll({
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