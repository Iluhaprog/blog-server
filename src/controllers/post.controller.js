const { PostApi } = require('../models');

async function create(req, res) {
    try {
        const { post } = req.body;
        const newPost = await PostApi.create(post);
        res.json(newPost);
    } catch (error) {
        console.error(error);
    }
}

async function getById(req, res) {
    try {
        const { id } = req.query;
        const post = await PostApi.getById(id);
        res.json(post);
    } catch (error) {
        console.error(error);
    }
}

async function getAll(req, res) {
    try {
        const posts = await PostApi.getAll();
        res.json(posts);
    } catch (error) {
        console.error(error);
    }
}

async function getByUserId(req, res) {
    try {
        const { userId } = req.query;
        const posts = await PostApi.getByUserId(userId);
        res.json(posts);
    } catch (error) {
        console.error(error);
    }
}

async function update(req, res) {
    try {
        const { post } = req.body;
        await PostApi.update(post);
        const updatedPost = await PostApi.getById(post.id);
        res.json(updatedPost);
    } catch (error) {
        console.error(error);
    }
}

async function setTags(req, res) {
    try {
        const { postId, tagsId } = req.body;
        await PostApi.setTags(postId, tagsId);
        res.status(204).send();
    } catch (error) {
        console.error(error);
    }
}

async function deleteById(req, res) {
    try {
        const { id } = req.query;
        await PostApi.deleteById(id);
        res.status(204).send();
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    create,
    getById,
    getAll,
    getByUserId,
    update,
    deleteById,
    setTags,
};