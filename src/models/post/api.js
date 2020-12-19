const { Tag } = require('../tag/model');
const { Post, PostTag } = require('./model');

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

async function setTags(postId, tagsId) {
    try {
        const post = await Post.findByPk(postId);
        const postsTags = await post.addTags(tagsId);
        postsTags.forEach(async postTag => {
            const postTagData = postTag.get({ plain: true });
            await PostTag.create({ 
                postId: postTagData.postId, 
                tagId: postTagData.tagId ,
            });
        });
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