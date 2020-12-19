const { File } = require('./model');
const { getModelData, getModelsDataArray } = require('../../libs/model.lib');

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

async function getByPostId(postId) {
    try {
        const postFiles = await File.findAll({
            where: {
                postId: postId,
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
    getByPostId,
    update,
    deleteById,
};