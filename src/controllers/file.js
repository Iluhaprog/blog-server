const { FileApi } = require('../models');

async function create(req, res) {
    try {
        const { file } = req.body;
        const newFile = await FileApi.create(file);
        res.json(newFile);
    } catch (error) {
        console.error(error);
    }
}

async function getById(req, res) {
    try {
        const { id } = req.query;
        const file = await FileApi.getById(id);
        res.json(file);
    } catch (error) {
        console.error(error);
    }
}

async function getByPostId(req, res) {
    try {
        const { postId } = req.query;
        const files = await FileApi.getByPostId(postId);
        res.json(files);
    } catch (error) {
        console.error(error);
    }
}

async function update(req, res) {
    try {
        const { file } = req.body;
        await FileApi.update(file);
        const updatedFile = await FileApi.getById(file.id);
        res.json(updatedFile);
    } catch (error) {
        console.error(error);
    }
}

async function deleteById(req, res) {
    try {
        const { id } = req.query;
        await FileApi.deleteById(id);
        res.status(204).send();
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    create,
    getById,
    getByPostId,
    update,
    deleteById,
};