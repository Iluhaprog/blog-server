const { Project } = require('./model');

async function create(project) {
    try { 
        const newProject = await Project.create(project);
        return newProject ? newProject.get({ plain: true }) : {};
    } catch (error) {
        console.error(error);
    }
}

async function getById(id) {
    try { 
        const project = await Project.findByPk(id);
        return project ? project.get({ plain: true }) : {};
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
        const projects = userProjects.map(project => project.get({ plain: true }));
        return projects;
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
    getByUserId,
    update,
    deleteById,
};