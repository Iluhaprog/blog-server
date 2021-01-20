const { FileApi, PostApi, DirectoryApi } = require('../models');
const { FileManager } = require('../libs/files');

async function create(req, res) {
    try {
        const { pathname, filename, dirname } = req.file;
        const dir = await DirectoryApi.getByName(dirname);
        const newFile = await FileApi.create({
            name: filename,
            path: pathname,
            directoryId: dir.id,
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

async function getByName(req, res) {
    try {
        const { name } = req.params;
        const file = await FileApi.getByName(name);
        if (file) {
            const { dirname } = await PostApi.getById(file.postId);
            const { path } = file;
            await FileManager.downloadFile(res, dirname, path, err => {
                if (err) res.status(404).send('Not found');
                res.status(200).send();
            })
        } else {
            res.status(404).send('Not found');
        }
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
    getByName,
    getByPostId,
    update,
    deleteById,
};