const { Project } = require('./model');
const { getModelData, getModelsDataArray } = require('../../libs/model');

async function create(project) {
    try { 
        const newProject = await Project.create(project);
        return getModelData(newProject);
    } catch (error) {
        console.error(error);
    }
}

async function getById(id) {
    try { 
        const project = await Project.findByPk(id);
        return getModelData(project);
    } catch (error) {
        console.error(error);
    }
}

async function getAll() {
    try {
        const projects = await Project.findAll();
        return getModelsDataArray(projects);
    } catch (error) {
        console.error(error);
    }
}

async function getByUserId(userId) {
    try { 
        const userProjects = await Project.findAll({
            where: {
                userId: userId,
            },
        });
        return getModelsDataArray(userProjects);
    } catch (error) {
        console.error(error);
    }
}

async function update(project) {
    try { 
        await Project.update(project, {
            where: {
                id: project.id,
            },
        });
    } catch (error) {
        console.error(error);
    }
}

async function deleteById(id) {
    try { 
        await Project.destroy({
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
    getAll,
    getByUserId,
    update,
    deleteById,
};