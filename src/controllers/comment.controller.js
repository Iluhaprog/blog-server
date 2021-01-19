const { paginate } = require('../libs/utls');
const { CommentApi } = require('../models');

async function create(req, res) {
    try {
        const { comment } = req.body;
        const newComment = await CommentApi.create(comment);
        res.json(newComment);
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}

async function getById(req, res) {
    try {
        const { id } = req.query;
        const comment = await CommentApi.getById(id);
        res.json(comment);
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}

async function getByPostId(req, res) {
    try {
        const { postId } = req.query;
        const { page, limit } = req.params;
        const pagination = paginate({page, limit});
        const comments = await CommentApi.getByPostId(postId, pagination);
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}

async function getByUserId(req, res) {
    try {
        const { userId } = req.query;
        const { page, limit } = req.params;
        const pagination = paginate({page, limit});
        const comments = await CommentApi.getByUserId(userId, pagination);
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}

async function getAll(req, res) {
    try {
        const { page, limit } = req.params;
        const comments = await CommentApi.getAll({
            ...paginate({page, limit}),
        });
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}

async function update(req, res) {
    try {
        const { comment } = req.body;
        await CommentApi.update(comment);
        const updatedComment = await CommentApi.getById(comment.id);
        res.json(updatedComment);
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}

async function deleteById(req, res) {
    try {
        const { id } = req.query;
        await CommentApi.deleteById(id);
        res.status(204).json();
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}

module.exports = {
    create, 
    getById,
    getAll,
    getByPostId,
    getByUserId,
    update,
    deleteById,
};