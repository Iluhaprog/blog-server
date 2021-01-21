const { File } = require('./model');
const { getModelData, getModelsDataArray } = require('../../libs/model');

async function create(file) {
    try {
        const newFile = await File.create(file);
        return getModelData(newFile);
    } catch (error) {
        console.error(error);
    }
}

async function getById(id) {
    try {
        const file = await File.findByPk(id);
        return getModelData(file);
    } catch (error) {
        console.error(error);
    }
}

async function getByName(name) {
    try {
        const file = await File.findOne({
            where: {
                name: name,
            },
        });
        return getModelData(file);
    } catch (error) {
        console.error(error);
    }
}

async function getByDirectoryId(directoryId) {
    try {
        const postFiles = await File.findAll({
            where: { 
                directoryId
            },
        });
        return getModelsDataArray(postFiles);
    } catch (error) {
        console.error(error);
    }
}

async function update(file) {
    try {
        await File.update(file, {
            where: {
                id: file.id,
            },
        });
    } catch (error) {
        console.error(error);
    }
}

async function deleteById(id) {
    try {
        await File.destroy({
            where: {
                id: id,
            },
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    create,
    getById,
    getByName,
    getByDirectoryId,
    update,
    deleteById,
};