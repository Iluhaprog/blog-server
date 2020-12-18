const { Post } = require('./model');

async function getById(id) {
    try {
        const post = await Post.findByPk(id);
        return post ? post.get({ plain: true }) : {};
    } catch (error) {
        console.error(error);
    }
}

async function getByUserId(userId) {
    try {
        const userPosts = await Post.findAll({
            where: {
                userId: userId,
            }
        });
        const posts = userPosts.map(post => post.get({ plain: true }));
        return posts || [];
    } catch (error) {
        console.error(error);
    }
}

async function create(post) {
    try {
        const newPost = await Post.create(post);
        return newPost ? newPost.get({ plain: true }) : {};
    } catch (error) {
        console.error(error);
    }
}

async function setTags(postId, tags) {
    try {
        // TO DO
    } catch (error) {
        console.error(error);
    }
}

async function update(post) {
    try {
        await Post.update(post, {
            where: {
                id: post.id,
            },
        });
    } catch (error) {
        console.error(error);
    }
}

async function deleteById(id) {
    try {
        await Post.destroy({
            where: {
                id: id,
            },
        });
    } catch (error) {
        console.error(error);
    }
} 


module.exports = {
    getById,
    getByUserId,
    create,
    update,
    deleteById,
    setTags,
};