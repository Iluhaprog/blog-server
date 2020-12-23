const { RoleApi } = require('../models');

async function create(req, res) {
    try {
        const { role } = req.query; 
        const newRole = await RoleApi.create(role);
        res.json(newRole);
    } catch (error) {
        console.error(error);
    }
}

async function getById(req, res) {
    try {
        const { id } = req.query;
        const role = await RoleApi.getById(id);
        res.json(role);
    } catch (error) {
        console.error(error);
    }
}

async function getByUser(req, res) {
    try {
        // TO DO       
    } catch (error) {
        console.error(error);
    }
}

async function deleteById(req, res) {
    try {
        const { id } = req.query;
        await RoleApi.deleteById(id);
        res.status(204).send();
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    create,
    getById,
    deleteById,
};