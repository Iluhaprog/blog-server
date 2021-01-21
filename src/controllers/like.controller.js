const { LikeApi } = require('../models');

async function create(req, res) {
    try {
        const { like } = req.body;
        const newLike = await LikeApi.create(like);
        res.json(newLike);
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}

async function getById(req, res) {
    try {
        const { id } = req.query;
        const like = await LikeApi.getById(id);
        res.json(like);
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}

async function getAll(req, res) {
    try {
        const likes = await LikeApi.getAll();
        res.json(likes);
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}

async function getByPostId(req, res) {
    try {
        const { postId } = req.query;
        const likes = await LikeApi.getByPostId(postId);
        res.json(likes);
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}

async function getByUserId(req, res) {
    try {
        const { userId } = req.query;
        const likes = await LikeApi.getByUserId(userId);
        res.json(likes);
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}

async function deleteById(req, res) {
    try {
        const { id } = req.query;
        await LikeApi.deleteById(id);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}

async function getCount(req, res) {
    try {
        const count = await LikeApi.getCount();
        res.status(200).json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).send(error)
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