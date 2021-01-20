const { FileManager } = require('../libs/files');
const { paginate } = require('../libs/utls');
const { PostApi, DirectoryApi } = require('../models');

async function create(req, res) {
    try {
        const { post } = req.body;
        const { title } = post;
        const dirname = title.split(' ').join('_').toLowerCase();
        const dir = await DirectoryApi.create(dirname);
        await DirectoryApi.createInDropbox(dir.name, async () => {
            const newPost = await PostApi.create({...post, directoryId: dir.id});
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
        const { directoryId } = await PostApi.getById(id);
        const dir = await DirectoryApi.getById(directoryId);
        await PostApi.deleteById(id);
        await DirectoryApi.deleteById(dir.id);
        await DirectoryApi.deleteInDropbox(dir.name, () => {
            res.status(204).send();
        });
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