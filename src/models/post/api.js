const { Post, PostTag } = require('./model');
const { getModelData, getModelsDataArray } = require('../../libs/model');

async function getById(id) {
    try {
        const post = await Post.findByPk(id);
        return getModelData(post);
    } catch (error) {
        console.error(error);
    }
}

async function getAll() {
    try {
        const posts = await Post.findAll();
        return getModelsDataArray(posts);
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
        return getModelsDataArray(userPosts);
    } catch (error) {
        console.error(error);
    }
}

async function create(post) {
    try {
        const { title } = post;
        const dirname = title.split(' ').join('_').toLowerCase();
        const newPost = await Post.create({...post, dirname});
        return getModelData(newPost);
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
    getAll,
    getByUserId,
    create,
    update,
    deleteById,
    setTags,
};