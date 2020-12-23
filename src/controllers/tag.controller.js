const { TagApi } = require('../models');

async function create(req, res) {
    try {
        const { tag } = req.body;
        const newTag = await TagApi.create(tag);
        res.json(newTag);
    } catch (error) {
        console.error(error);
    }
}

async function getById(req, res) {
    try {
        const { id } = req.query;
        const tag = await TagApi.getById(id);
        res.json(tag);
    } catch (error) {
        console.error(error);
    }
}

async function getByPostId(req, res) {
    try {
        const { postId } = req.query;
        const tags = await TagApi.getByPostId(postId);
        res.json(tags);
    } catch (error) {
        console.error(error);
    }
}

async function deleteById(req, res) {
    try {
        const { id } = req.query;
        await TagApi.deleteById(id);
        res.status(204).send();
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    create,
    getById,
    getByPostId,
    deleteById,
};