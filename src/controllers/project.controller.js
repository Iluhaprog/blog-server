const { ProjectApi } = require('../models');

async function create(req, res) {
    try {
        const { project } = req.body;
        const newProject = await ProjectApi.create(project);
        res.json(newProject);
    } catch (error) {
        console.error(error);
    }
}

async function getById(req, res) {
    try {
        const { id } = req.query;
        const project = await ProjectApi.getById(id);
        res.json(project);
    } catch (error) {
        console.error(error);
    }
}

async function getByUserId(req, res) {
    try {
        const { userId } = req.query;
        const projects = await ProjectApi.getByUserId(userId);
        res.json(projects);
    } catch (error) {
        console.error(error);
    }
}

async function update(req, res) {
    try {
        const { project } = req.body;
        await ProjectApi.update(project);
        const updatedProject = await ProjectApi.getById(project.id);
        res.json(updatedProject);
    } catch (error) {
        console.error(error);
    }
}

async function deleteById(req, res) {
    try {
        const { id } = req.query;
        await ProjectApi.deleteById(id);
        res.status(204).send();
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    create,
    getById,
    getByUserId,
    update,
    deleteById,
};