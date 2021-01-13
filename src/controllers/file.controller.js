const { FileApi } = require('../models');
const { FileManager } = require('../libs/files');

async function create(req, res) {
    try {
        const { pathname, filename } = req.file;
        const { postId } = req.query;
        const newFile = await FileApi.create({
            name: filename,
            path: pathname,
            postId,
        });
        res.json(newFile);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}

async function getById(req, res) {
    try {
        const { id } = req.query;
        const file = await FileApi.getById(id);
        res.json(file);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}

async function getByPostId(req, res) {
    try {
        const { postId } = req.query;
        const files = await FileApi.getByPostId(postId);
        res.json(files);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
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
        res.status(400).send(error);
    }
}

async function deleteById(req, res) {
    try {
        const { id, dirname } = req.query;
        const file = await FileApi.getById(id);
        await FileManager.delete(dirname, file.path, async (err, result, response) => {
            if (err) console.error(err);
            await FileApi.deleteById(id);
            res.status(204).send();
        })
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}

module.exports = {
    create,
    getById,
    getByPostId,
    update,
    deleteById,
};