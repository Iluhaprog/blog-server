const { HomeApi, DirectoryApi, FileApi } = require('../models');

async function get(req, res) {
    try {
        const home = await HomeApi.get();
        res.status(200).json(home);
    } catch (error) {
        console.error(error);
    }
}

async function update(req, res) {
    try {
        const { home } = req.body;
        await HomeApi.update(home);
        const updatedHome = await HomeApi.get();
        res.status(200).json(updatedHome);
    } catch (error) {
        console.error(error);
    }
}

async function updatePreview(req, res) {
    try {
        const { pathname, filename, dirname } = req.file;
        const home = await HomeApi.get();
        const dir = await DirectoryApi.getByName(dirname); 
        const file = await FileApi.create({
            name: filename,
            path: pathname,
            directoryId: dir.id,
        });
        await HomeApi.update({
            ...home,
            preview: file.name,
        });
        const updatedHome = await HomeApi.get();
        res.status(200).json(updatedHome);
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    get,
    update,
    updatePreview,
}