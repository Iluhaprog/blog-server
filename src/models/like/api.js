const { Like } = require('./model');

async function create(like) {
    try {
        const newLike = await Like.create(like);
        return newLike ? newLike.get({ plain: true }) : {};
    } catch (error) {
        console.error(error);
    }
}

async function getById(id) {
    try {
        const like = await Like.findByPk(id);
        return like ? like.get({ plain: true }) : {};
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
        const likes = userLikes.map(like => like.get({ plain: true }));
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
        const likes = postLikes.map(like => like.get({ plain: true }));
        return likes;
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
module.exports = { 
    create,
    getById,
    getByUserId,
    getByPostId,
    deleteById,
};