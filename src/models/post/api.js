const { Post, PostTag } = require('./model');
const { getModelData, getModelsDataArray } = require('../../libs/model');
const { Tag } = require('../tag/model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

async function getById(id) {
    try {
        const post = await Post.findByPk(id);
        return getModelData(post);
    } catch (error) {
        console.error(error);
    }
}

async function getAll({offset, limit}) {
    try {
        const posts = await Post.findAll({
            offset,
            limit,
        });
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
        const newPost = await Post.create(post);
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

async function getCount() {
    try {
        const count = await Post.count();
        return count;
    } catch (error) {
        console.error(error);
    }
}

async function search(query, tags = [], offset = 0, limit = 10) {
    try {
        const params = {};
        if (tags.length) {
            const tagsString = tags.join('|');
            params.include = [{
                model: Tag,
                where: {
                    title: {
                        [Op.regexp]: tagsString,
                    }
                },
            }];
        } 
        if (query) {
            params.where = {
                title: {
                    [Op.like]: `%${query}%`,
                }
            }
        }
        const posts = await Post.findAll({
            ...params,
            offset,
            limit,
        });
        const count = await Post.count({
            ...params,
            group: ['id'],
        });
        return {posts: getModelsDataArray(posts), count: count.length};
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
    getCount,
    search,
};