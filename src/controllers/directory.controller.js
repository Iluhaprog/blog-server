const { DirectoryApi } = require('../models');

async function getById(req, res) {
    try {
        const { id } = req.query;
        const directory = await DirectoryApi.getById(id);
        res.status(200).json(directory);
    } catch (error) {
        console.log(error);
        res.status(400).send();
    }
}

module.exports = {
    getById,
};