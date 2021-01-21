const { Like } = require('./model');
const { getModelData, getModelsDataArray } = require('../../libs/model');

async function create(like) {
    try {
        const newLike = await Like.create(like);
        return getModelData(newLike);
    } catch (error) {
        console.error(error);
    }
}

async function getById(id) {
    try {
        const like = await Like.findByPk(id);
        return getModelData(like);
    } catch (error) {
        console.error(error);
    }
}

async function getAll() {
    try {
        const likes = await Like.findAll();
        return getModelsDataArray(likes);
    } catch (error) {
        console.error(error);
    }
}

async function getByUserId(userId) {
    try {
        const userLikes = await Like.findAll({
            where: {
                userId: userId,
            },
        });
        const likes = getModelsDataArray(userLikes);
        return likes;
    } catch (error) {
        console.error(error);
    }
}

async function getByPostId(postId) {
    try {
        const postLikes = await Like.findAll({
            where: {
                postId: postId,
            },
        });
        return getModelsDataArray(postLikes);
    } catch (error) {
        console.error(error);
    }
}

async function deleteById(id) {
    try {
        await Like.destroy({
            where: {
                id: id,
            },
        });
    } catch (error) {
        console.error(error);
    }
}

async function getCount() {
    try {
        const count = await Like.count();
        return count;
    } catch (error) {
        console.error(error);
    }
}

module.exports = { 
    create,
    getById,
    getAll,
    getByUserId,
    getByPostId,
    deleteById,
    getCount,
};