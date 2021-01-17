const { FileManager } = require('../libs/files');
const { paginate } = require('../libs/utls');
const { PostApi } = require('../models');

async function create(req, res) {
    try {
        const { post } = req.body;
        const newPost = await PostApi.create(post);
        await FileManager.createDir(newPost.dirname, err => {
            if (err) res.status(500).send();
            res.json(newPost);
        });
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}

async function getById(req, res) {
    try {
        const { id } = req.query;
        const post = await PostApi.getById(id);
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}

async function getAll(req, res) {
    try {
        const { page, limit } = req.params;
        const posts = await PostApi.getAll({
            ...paginate({page, limit})
        });
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}

async function getByUserId(req, res) {
    try {
        const { userId } = req.query;
        const posts = await PostApi.getByUserId(userId);
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
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
        res.status(400).send(error)
    }
}

async function setTags(req, res) {
    try {
        const { postId, tagsId } = req.body;
        await PostApi.setTags(postId, tagsId);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}

async function deleteById(req, res) {
    try {
        const { id } = req.query;
        const { dirname } = await PostApi.getById(id);
        await PostApi.deleteById(id);
        await FileManager.delete(dirname, '', err => console.error(err));
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
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