const { Directory } = require('./model');
const { FileManager } = require('../../libs/files');
const { getModelData } = require('../../libs/model');

async function create(name) {
    try {
        const newDir = await Directory.create({ name });
        return getModelData(newDir);
    } catch (error) {
        console.error(error);
    }
}

async function createInDropbox(name, callback = () => {}) {
    try {
        await FileManager.createDir(name, err => {
            if (err) console.error(err);
            else callback();
        });
    } catch (error) {
        console.error(error);
    }
}

async function deleteInDropbox(name, callback = () => {}) {
    try {
        await FileManager.delete(name, '', err => {
            if (err) console.error(err);
            else callback();
        });
    } catch (error) {
        console.error(error);
    }
}

async function getById(id) {
    try {
        const dir = await Directory.findByPk(id);
        return getModelData(dir);
    } catch (error) {
        console.error(error);
    }
}

async function getByName(name) {
    try {
        const dir = await Directory.findOne({
            where: { name },
        });
        return getModelData(dir);
    } catch (error) {
        console.error(error);
    }
}

async function deleteById(id) {
    try {
        await Directory.destroy({
            where: { id },
        });
    } catch (error) {
        console.error(error);
    }
}
module.exports = {
    create,
    createInDropbox,
    getById,
    getByName,
    deleteById,
    deleteInDropbox,
};